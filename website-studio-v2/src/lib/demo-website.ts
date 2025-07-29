export const DEMO_WEBSITE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Website - Customize Me!</title>
    <style id="custom-css"></style>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        .hero {
            background: #f5f5f5;
            padding: 4rem 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        
        .hero p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
        }
        
        .btn {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 5px;
            text-decoration: none;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
            font-size: 1rem;
        }
        
        .btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .features {
            padding: 4rem 0;
            background: white;
        }
        
        .features h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 3rem;
            color: #2c3e50;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .card {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        
        .card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        
        .card p {
            color: #666;
            margin-bottom: 1rem;
        }
        
        .footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        .contact-form {
            background: #f5f5f5;
            padding: 4rem 0;
        }
        
        .form {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .form-group textarea {
            resize: vertical;
            min-height: 120px;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">TechCorp</div>
                <ul class="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Welcome to TechCorp</h1>
            <p>Transform your business with cutting-edge technology solutions</p>
            <a href="#features" class="btn">Get Started</a>
        </div>
    </section>
    
    <section class="features" id="features">
        <div class="container">
            <h2>Our Features</h2>
            <div class="feature-grid">
                <div class="card">
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast load times and optimized code ensure your applications run smoothly.</p>
                    <button class="btn">Learn More</button>
                </div>
                <div class="card">
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security measures protect your data and ensure 99.9% uptime.</p>
                    <button class="btn">Learn More</button>
                </div>
                <div class="card">
                    <h3>Easy Integration</h3>
                    <p>Seamlessly integrate with your existing tools and workflows without disruption.</p>
                    <button class="btn">Learn More</button>
                </div>
            </div>
        </div>
    </section>
    
    <section class="contact-form" id="contact">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 2rem; color: #2c3e50;">Get In Touch</h2>
            <form class="form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your name">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com">
                </div>
                <div class="form-group">
                    <label>Message</label>
                    <textarea placeholder="Your message"></textarea>
                </div>
                <button type="submit" class="btn" style="width: 100%;">Send Message</button>
            </form>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 TechCorp. All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Listen for CSS updates from parent
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'UPDATE_CSS') {
                const customStyle = document.getElementById('custom-css');
                if (customStyle) {
                    customStyle.textContent = event.data.css;
                }
            }
        });
        
        // Prevent actual navigation
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                e.preventDefault();
            }
        });
    </script>
</body>
</html>
`;

export function getDemoWebsiteForUrl(_url: string): string {
  // You can customize the demo based on the URL if needed
  return DEMO_WEBSITE_HTML;
}
