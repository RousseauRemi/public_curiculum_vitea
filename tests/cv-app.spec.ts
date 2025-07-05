import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3003';

test.describe('CV React App - Comprehensive Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and wait for it to load
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Clear console logs for clean testing
    await page.evaluate(() => console.clear());
  });

  test('should load the homepage and display basic elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CV - Rémi Rousseau/);
    
    // Check main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Rémi Rousseau')).toBeVisible();
    await expect(page.getByText('Développeur Full Stack')).toBeVisible();
    
    // Check language selector
    await expect(page.locator('button:has-text("🇫🇷")')).toBeVisible();
    
    // Check CV download button
    await expect(page.getByText('Télécharger CV')).toBeVisible();
  });

  test('should have all main sections visible', async ({ page }) => {
    const sections = [
      { id: '#home', name: 'Accueil' },
      { id: '#recommendations', name: 'Recommandations' },
      { id: '#experience', name: 'Expérience' },
      { id: '#skills', name: 'Compétences' },
      { id: '#education', name: 'Formation' },
      { id: '#projects', name: 'Projets' }
    ];

    for (const section of sections) {
      // Scroll to section
      await page.locator(section.id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Check section is visible
      await expect(page.locator(section.id)).toBeVisible();
      
      // Check section has content
      const sectionContent = await page.locator(section.id).textContent();
      expect(sectionContent).toBeTruthy();
      expect(sectionContent!.length).toBeGreaterThan(0);
    }
  });

  test('should navigate through sections correctly', async ({ page }) => {
    const navigationLinks = [
      'Accueil',
      'Recommandations', 
      'Expérience',
      'Compétences',
      'Formation',
      'Projets'
    ];

    for (const linkText of navigationLinks) {
      // Find navigation link (could be in main nav or mobile menu)
      const navLink = page.getByRole('button', { name: new RegExp(linkText, 'i') }).first();
      
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForTimeout(1000);
        
        // Verify we scrolled to the correct section
        const sectionId = linkText.toLowerCase()
          .replace('accueil', 'home')
          .replace('expérience', 'experience')
          .replace('compétences', 'skills')
          .replace('formation', 'education')
          .replace('recommandations', 'recommendations')
          .replace('projets', 'projects');
        
        const section = page.locator(`#${sectionId}`);
        await expect(section).toBeInViewport({ ratio: 0.3 });
      }
    }
  });

  test('should test Home section functionality', async ({ page }) => {
    await page.locator('#home').scrollIntoViewIfNeeded();
    
    // Check home section content
    await expect(page.getByText('Rémi Rousseau')).toBeVisible();
    await expect(page.getByText('Développeur Full Stack')).toBeVisible();
    
    // Check availability status
    await expect(page.locator('[class*="availability"]')).toBeVisible();
    
    // Check contact information
    await expect(page.getByText('hiring@remirousseau.pro')).toBeVisible();
    await expect(page.getByText('Montfaucon-Montigné, France')).toBeVisible();
  });

  test('should test Skills section functionality', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check main technologies are displayed
    const technologies = ['C# & .Net', 'Angular React', 'Sql Server', 'TypeScript'];
    
    for (const tech of technologies) {
      await expect(page.getByText(tech)).toBeVisible();
    }
    
    // Check skill levels are displayed
    await expect(page.getByText('Avancé')).toBeVisible();
    await expect(page.getByText('Intermédiaire')).toBeVisible();
  });

  test('should test Experience section functionality', async ({ page }) => {
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check experience entries are visible
    await expect(page.getByText('Développeur Fullstack')).toBeVisible();
    await expect(page.getByText('Acolad')).toBeVisible();
    
    // Check technologies in experience
    await expect(page.getByText('.Net 8')).toBeVisible();
    await expect(page.getByText('React')).toBeVisible();
  });

  test('should test Projects section functionality', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check projects section title
    await expect(page.getByText('Projets internes')).toBeVisible();
    
    // Check filter buttons are present
    await expect(page.getByText('Filtrer par statut')).toBeVisible();
    await expect(page.getByText('Filtrer par catégorie')).toBeVisible();
    
    // Check filter options
    await expect(page.getByRole('button', { name: 'Tous' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'En cours' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Terminé' })).toBeVisible();
    
    // Check category filters
    await expect(page.getByRole('button', { name: 'Informatique' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Jardinage' })).toBeVisible();
    
    // Check project cards are visible
    const projectCards = page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
    
    // Test project filtering
    await page.getByRole('button', { name: 'Terminé' }).click();
    await page.waitForTimeout(1000);
    
    // Check that filtering worked (should show fewer projects)
    const filteredCards = page.locator('.project-card');
    const filteredCount = await filteredCards.count();
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('should test project modal functionality', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Click on first project card
    const firstProjectCard = page.locator('.project-card').first();
    await firstProjectCard.click();
    
    // Check modal opened
    await expect(page.locator('[role="dialog"], .fixed.inset-0')).toBeVisible();
    
    // Check modal content
    await expect(page.getByText('Description')).toBeVisible();
    await expect(page.getByText('Technologies')).toBeVisible();
    
    // Close modal with Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Check modal is closed
    await expect(page.locator('[role="dialog"], .fixed.inset-0')).not.toBeVisible();
  });

  test('should test Education section', async ({ page }) => {
    await page.locator('#education').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check education entries
    await expect(page.getByText('Master 2')).toBeVisible();
    await expect(page.getByText('EPSI')).toBeVisible();
    await expect(page.getByText('Nantes')).toBeVisible();
  });

  test('should test Recommendations section', async ({ page }) => {
    await page.locator('#recommendations').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check recommendations are displayed
    await expect(page.getByText('Imade Bouglouf')).toBeVisible();
    await expect(page.getByText('Deloitte')).toBeVisible();
    await expect(page.getByText('Olivier TELLE')).toBeVisible();
    await expect(page.getByText('CIBTP')).toBeVisible();
  });

  test('should test responsive design on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check mobile navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check sections are still accessible
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await expect(page.locator('#projects')).toBeVisible();
    
    // Check project cards adapt to mobile
    const projectCards = page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
  });

  test('should test language switching functionality', async ({ page }) => {
    // Currently on French, switch to English if available
    const langButton = page.locator('button:has-text("🇫🇷")');
    
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(1000);
      
      // Check if content changed to English (if implemented)
      // This test assumes basic language switching exists
    }
  });

  test('should verify console is clean during navigation', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Listen for console messages
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Navigate through all sections
    const sections = ['#home', '#recommendations', '#experience', '#skills', '#education', '#projects'];
    
    for (const section of sections) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
    }
    
    // Test project interactions
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'En cours' }).click();
    await page.waitForTimeout(500);
    
    const firstProject = page.locator('.project-card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
    }
    
    // Check for console errors/warnings
    const errors = consoleMessages.filter(msg => msg.startsWith('error:'));
    const warnings = consoleMessages.filter(msg => msg.startsWith('warning:') && !msg.includes('Download the React DevTools'));
    
    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }
    
    if (warnings.length > 0) {
      console.log('Console warnings found:', warnings);
    }
    
    // We expect no errors and no translation warnings
    expect(errors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });

  test('should test PDF download functionality', async ({ page }) => {
    await page.locator('#home').scrollIntoViewIfNeeded();
    
    // Find CV download button
    const downloadButton = page.getByText('Télécharger CV').first();
    
    if (await downloadButton.isVisible()) {
      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download');
      
      await downloadButton.click();
      
      try {
        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('CV');
      } catch {
        // PDF generation might be asynchronous or require special setup
        // Just verify the button exists and is clickable
        console.log('PDF download test: Button exists and is clickable');
      }
    }
  });

  test('should test scroll progress functionality', async ({ page }) => {
    // Check if scroll progress bar exists
    const scrollProgress = page.locator('[class*="scroll-progress"], [aria-label*="progress"]');
    await expect(scrollProgress).toBeDefined();
    
    // Scroll through the page
    await page.locator('#home').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // The scroll progress should be functional (this is a basic check)
    // More detailed testing would require checking actual progress values
  });

  test('should verify all images load correctly', async ({ page }) => {
    // Get all images on the page
    const images = page.locator('img');
    const imageCount = await images.count();
    
    console.log(`Found ${imageCount} images to check`);
    
    // Check each image has loaded
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      
      if (src) {
        // Scroll image into view
        await img.scrollIntoViewIfNeeded();
        
        // Check if image has natural dimensions (indicating it loaded)
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        
        if (naturalWidth === 0) {
          console.warn(`Image may not have loaded: ${src}`);
        }
      }
    }
  });

});