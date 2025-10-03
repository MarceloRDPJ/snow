import os
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    Navigates to the local server, simulates scrolling through the
    improved lobby, and takes screenshots to verify all the new
    visual and animation enhancements.
    """
    # 1. Arrange: Go to the local web server.
    page.goto('http://localhost:8000')
    # Wait for the 3D scene and aurora to initialize
    page.wait_for_timeout(3000)

    # 2. Act & Assert (Start): Capture the initial view with the aurora.
    page.screenshot(path='jules-scratch/verification/improved_lobby_start.png', full_page=True)
    print("Screenshot 1: Start of improved journey captured.")

    # 3. Act & Assert (Login Section): Scroll to the login section.
    page.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.55)")
    page.wait_for_timeout(1000) # Wait for JS to apply classes

    # *** START DEBUGGING INSTRUMENTATION ***
    intro_classes = page.evaluate("document.getElementById('intro').className")
    login_classes = page.evaluate("document.getElementById('login-section').className")
    print(f"[DEBUG] #intro classes: '{intro_classes}'")
    print(f"[DEBUG] #login-section classes: '{login_classes}'")
    # *** END DEBUGGING INSTRUMENTATION ***

    expect(page.locator('#login-section')).to_be_visible()
    page.wait_for_timeout(2000) # Wait for animations
    page.screenshot(path='jules-scratch/verification/improved_lobby_login.png', full_page=True)
    print("Screenshot 2: Improved login section captured.")

    # 4. Act & Assert (Construction Section): Scroll to the end.
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    expect(page.locator('#construction-section')).to_be_visible()
    # Wait for the icon draw-in animation
    page.wait_for_timeout(2000)
    page.screenshot(path='jules-scratch/verification/improved_lobby_end.png', full_page=True)
    print("Screenshot 3: Improved construction section captured.")

# --- Boilerplate to run the script ---
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        run_verification(page)
        browser.close()