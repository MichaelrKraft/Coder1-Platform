/**
 * Electron Server Integration
 * Runs Express app inside Electron to bypass macOS networking issues
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

let app;
let isInitialized = false;

function initializeServer() {
  if (isInitialized) return app;
  
  // Load the Express app
  app = require('./src/app-simple.js');
  
  // Override the listen method since we don't need actual network binding
  app.listen = (port, callback) => {
    console.log(`Express app initialized (simulated port ${port})`);
    if (callback) callback();
    return { close: () => {} };
  };
  
  isInitialized = true;
  return app;
}

function handleRequest(request, callback) {
  const app = initializeServer();
  
  // Convert Electron request to Express-compatible format
  const url = new URL(request.url);
  const req = {
    url: url.pathname + url.search,
    method: request.method,
    headers: request.headers,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    body: null // Initialize body
  };
  
  // Handle POST/PUT requests with body
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    let body = [];
    
    request.on('data', (chunk) => {
      body.push(chunk);
    });
    
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      
      // Try to parse as JSON
      try {
        req.body = JSON.parse(bodyString);
      } catch (e) {
        // If not JSON, keep as string
        req.body = bodyString;
      }
      
      // Now process the request with body
      processRequest(app, req, callback);
    });
    
    request.on('error', (err) => {
      console.error('Request stream error:', err);
      callback({
        statusCode: 500,
        headers: { 'Content-Type': 'text/plain' },
        data: Buffer.from('Request stream error')
      });
    });
    
    return; // Don't process yet, wait for body
  }
  
  // For non-body requests (GET, DELETE, etc.), process immediately
  processRequest(app, req, callback);
}

function processRequest(app, req, callback) {
  // Create a mock response object
  const res = {
    statusCode: 200,
    headers: {},
    data: [],
    
    status(code) {
      this.statusCode = code;
      return this;
    },
    
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    
    setHeader(name, value) {
      this.headers[name] = value;
    },
    
    json(obj) {
      this.headers['Content-Type'] = 'application/json';
      this.data = [Buffer.from(JSON.stringify(obj))];
      this.end();
    },
    
    send(data) {
      if (typeof data === 'string') {
        this.data = [Buffer.from(data)];
      } else if (Buffer.isBuffer(data)) {
        this.data = [data];
      } else {
        this.json(data);
        return;
      }
      this.end();
    },
    
    sendFile(filePath, options, cb) {
      const fs = require('fs');
      fs.readFile(filePath, (err, data) => {
        if (err) {
          this.statusCode = 404;
          this.data = [Buffer.from('File not found')];
          if (cb) cb(err);
        } else {
          this.data = [data];
          // Set content type based on file extension
          const ext = path.extname(filePath).toLowerCase();
          const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
          };
          this.headers['Content-Type'] = contentTypes[ext] || 'application/octet-stream';
          if (cb) cb(null);
        }
        this.end();
      });
    },
    
    end() {
      callback({
        statusCode: this.statusCode,
        headers: this.headers,
        data: Buffer.concat(this.data)
      });
    }
  };
  
  // Handle the request through Express
  try {
    app(req, res);
  } catch (error) {
    console.error('Request handling error:', error);
    callback({
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      data: Buffer.from('Internal Server Error')
    });
  }
}

module.exports = {
  initializeServer,
  handleRequest
};