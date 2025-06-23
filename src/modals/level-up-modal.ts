import { App, Modal, DropdownComponent, TextComponent, Notice } from 'obsidian';
import CharacterManagerPlugin from '../../main';
import { DND_DATA, Character } from '../dnd-data';

export class LevelUpModal extends Modal {
    plugin: CharacterManagerPlugin;
    selectedCharacter: Character | null = null;

    constructor(app: App, plugin: CharacterManagerPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // Add custom styles
        const style = contentEl.createEl('style');
        style.textContent = `
            .level-up-modal {
                max-width: 700px;
                max-height: 85vh;
                overflow-y: auto;
            }
            .character-status {
                padding: 20px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 8px;
                margin-bottom: 20px;
                background-color: var(--background-secondary);
            }
            .status-header {
                font-size: 1.3em;
                font-weight: bold;
                margin-bottom: 15px;
                color: var(--text-accent);
            }
            .status-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 15px;
            }
            .status-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid var(--background-modifier-border-hover);
            }
            .status-label {
                font-weight: 500;
            }
            .status-value {
                color: var(--text-accent);
                font-weight: bold;
            }
            .xp-section {
                margin: 20px 0;
                padding: 15px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 6px;
            }
            .xp-input-group {
                display: flex;
                gap: 10px;
                align-items: end;
                margin-top: 10px;
            }
            .xp-input {
                flex: 1;
                max-width: 150px;
            }
            .level-up-section {
                margin: 20px 0;
                padding: 15px;
                border: 1px solid var(--interactive-accent);
                border-radius: 6px;
                background-color: var(--background-primary);
            }
            .features-list {
                background-color: var(--background-secondary);
                padding: 15px;
                border-radius: 6px;
                margin: 15px 0;
            }
            .features-list h4 {
                margin-top: 0;
                color: var(--text-accent);
            }
            .features-list ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .features-list li {
                margin: 5px 0;
            }
            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            .progress-bar {
                width: 100%;
                height: 20px;
                background-color: var(--background-modifier-border);
                border-radius: 10px;
                overflow: hidden;
                margin: 10px 0;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--interactive-accent), var(--interactive-accent-hover));
                transition: width 0.3s ease;
            }
            .ready-to-level {
                border-color: var(--color-green);
                background-color: var(--color-green-rgb);
            }
        `;

        contentEl.addClass('level-up-modal');
        contentEl.createEl('h2', { text: 'Level Up Character' });

        if (this.plugin.characters.length === 0) {
            const emptyState = contentEl.createDiv();
            emptyState.style.textAlign = 'center';
            emptyState.style.padding = '40px 20px';
            emptyState.style.color = 'var(--text-muted)';
            
            emptyState.createEl('div', { text: '📈', attr: { style: 'font-size: 48px; margin-bottom: 16px;' } });
            emptyState.createEl('h3', { text: 'No characters found' });
            emptyState.createEl('p', { text: 'Create a D&D character first to use the level up system!' });
            return;
        }

        // Character selector
        const characterSection = contentEl.createDiv();
        characterSection.createEl('h3', { text: 'Select Character' });
        characterSection.createEl('label', { text: 'Choose character to level up:' });
        const characterDropdown = new DropdownComponent(characterSection);
        characterDropdown.addOption('', 'Choose character...');
        this.plugin.characters.forEach(char => {
            characterDropdown.addOption(char.name, char.name);
        });

        const levelUpSection = contentEl.createDiv();
        levelUpSection.style.marginTop = '20px';
        levelUpSection.style.display = 'none';

        characterDropdown.onChange(async (value) => {
            if (value) {
                this.selectedCharacter = this.plugin.characters.find(char => char.name === value) || null;
                if (this.selectedCharacter) {
                    await this.displayLevelUpOptions(levelUpSection);
                    levelUpSection.style.display = 'block';
                }
            } else {
                levelUpSection.style.display = 'none';
            }
        });
    }

    async displayLevelUpOptions(container: HTMLElement) {
        container.empty();
        
        if (!this.selectedCharacter) return;

        try {
            // Read character file to get current stats
            const content = await this.app.vault.read(this.selectedCharacter.file);
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            
            if (!frontmatterMatch) {
                container.createEl('div', { 
                    text: '⚠️ This character file does not have the required frontmatter for level advancement.',
                    attr: { style: 'padding: 20px; text-align: center; color: var(--text-error);' }
                });
                return;
            }

            // Parse YAML frontmatter (simplified parsing)
            const frontmatter = this.parseSimpleYAML(frontmatterMatch[1]);
            const currentLevel = frontmatter.level || 1;
            const currentXP = frontmatter.experience || 0;
            const nextLevel = currentLevel + 1;
            const xpForNextLevel = this.plugin.getNextLevelExperience(currentLevel);
            const xpNeeded = Math.max(0, xpForNextLevel - currentXP);
            const xpProgress = Math.min(100, (currentXP / xpForNextLevel) * 100);

            // Display current status
            const statusSection = container.createDiv('character-status');
            const isReadyToLevel = xpNeeded === 0 && currentLevel < 20;
            
            if (isReadyToLevel) {
                statusSection.addClass('ready-to-level');
            }

            statusSection.createDiv('status-header').textContent = `${this.selectedCharacter.name} - Level ${currentLevel}`;

            const statusGrid = statusSection.createDiv('status-grid');
            
            const currentXPItem = statusGrid.createDiv('status-item');
            currentXPItem.createDiv('status-label').textContent = 'Current XP:';
            currentXPItem.createDiv('status-value').textContent = currentXP.toLocaleString();

            if (currentLevel < 20) {
                const nextLevelItem = statusGrid.createDiv('status-item');
                nextLevelItem.createDiv('status-label').textContent = `XP for Level ${nextLevel}:`;
                nextLevelItem.createDiv('status-value').textContent = xpForNextLevel.toLocaleString();

                const xpNeededItem = statusGrid.createDiv('status-item');
                xpNeededItem.createDiv('status-label').textContent = 'XP Needed:';
                const xpNeededValue = xpNeededItem.createDiv('status-value');
                xpNeededValue.textContent = xpNeeded.toLocaleString();
                if (xpNeeded === 0) {
                    xpNeededValue.style.color = 'var(--color-green)';
                    xpNeededValue.textContent = 'READY TO LEVEL UP!';
                }

                // Progress bar
                const progressBar = statusSection.createDiv('progress-bar');
                const progressFill = progressBar.createDiv('progress-fill');
                progressFill.style.width = `${xpProgress}%`;
            } else {
                const maxLevelItem = statusGrid.createDiv('status-item');
                maxLevelItem.createDiv('status-label').textContent = 'Status:';
                maxLevelItem.createDiv('status-value').textContent = 'MAX LEVEL';
            }

            if (currentLevel >= 20) {
                statusSection.createEl('p', { 
                    text: '🎉 Character is already at maximum level!',
                    attr: { style: 'text-align: center; font-weight: bold; color: var(--color-orange);' }
                });
                return;
            }

            // XP Award Section
            const xpSection = container.createDiv('xp-section');
            xpSection.createEl('h4', { text: '⭐ Award Experience' });
            
            const xpInputGroup = xpSection.createDiv('xp-input-group');
            const xpInput = new TextComponent(xpInputGroup);
            xpInput.inputEl.type = 'number';
            xpInput.inputEl.placeholder = 'Enter XP to award';
            xpInput.inputEl.min = '0';
            xpInput.inputEl.addClass('xp-input');

            const awardXPButton = xpInputGroup.createEl('button', { text: 'Award XP' });
            awardXPButton.onclick = () => this.awardExperience(parseInt(xpInput.getValue()) || 0);

            // Quick XP buttons
            const quickXPContainer = xpSection.createDiv();
            quickXPContainer.style.marginTop = '10px';
            quickXPContainer.createEl('span', { text: 'Quick awards: ', attr: { style: 'font-size: 0.9em; color: var(--text-muted);' } });
            
            [50, 100, 250, 500, 1000].forEach(amount => {
                const quickBtn = quickXPContainer.createEl('button', { text: `${amount} XP` });
                quickBtn.style.margin = '0 5px 5px 0';
                quickBtn.style.fontSize = '0.8em';
                quickBtn.onclick = () => this.awardExperience(amount);
            });

            // Direct Level Up Section
            const levelUpSection = container.createDiv('level-up-section');
            levelUpSection.createEl('h4', { text: '📈 Direct Level Up' });
            
            if (isReadyToLevel) {
                levelUpSection.createEl('p', { 
                    text: '✅ This character has enough XP to level up!',
                    attr: { style: 'color: var(--color-green); font-weight: bold;' }
                });
            }
            
            const levelUpButton = levelUpSection.createEl('button', { 
                text: `Level Up to ${nextLevel}`, 
                cls: isReadyToLevel ? 'mod-cta' : '' 
            });
            levelUpButton.onclick = () => this.levelUpCharacter();

            // Show features gained at next level
            const featuresSection = container.createDiv('features-list');
            featuresSection.createEl('h4', { text: `🎯 Features Gained at Level ${nextLevel}` });
            
            const className = frontmatter.class || 'Unknown';
            const features = this.getClassFeaturesForLevel(className, nextLevel);
            
            if (features.length > 0) {
                const featuresList = featuresSection.createEl('ul');
                features.forEach(feature => {
                    featuresList.createEl('li', { text: feature });
                });
            } else {
                featuresSection.createEl('p', { text: 'No specific features listed for this level.' });
            }

        } catch (error) {
            container.createEl('div', { 
                text: '❌ Error parsing character data. Please check the file format.',
                attr: { style: 'padding: 20px; text-align: center; color: var(--text-error);' }
            });
        }
    }

    parseSimpleYAML(yamlString: string): any {
        const result: any = {};
        const lines = yamlString.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const colonIndex = trimmed.indexOf(':');
                if (colonIndex !== -1) {
                    const key = trimmed.substring(0, colonIndex).trim();
                    const value = trimmed.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                    
                    // Try to parse as number
                    if (!isNaN(Number(value))) {
                        result[key] = Number(value);
                    } else {
                        result[key] = value;
                    }
                }
            }
        }
        
        return result;
    }

    getClassFeaturesForLevel(className: string, level: number): string[] {
        const features: { [key: string]: { [level: number]: string[] } } = {
            "Fighter": {
                1: ["Fighting Style", "Second Wind"],
                2: ["Action Surge"],
                3: ["Martial Archetype"],
                4: ["Ability Score Improvement"],
                5: ["Extra Attack"],
                6: ["Ability Score Improvement"],
                7: ["Martial Archetype Feature"],
                8: ["Ability Score Improvement"],
                9: ["Indomitable"],
                10: ["Martial Archetype Feature"],
                11: ["Extra Attack (2)"],
                12: ["Ability Score Improvement"],
                13: ["Indomitable (2)"],
                14: ["Ability Score Improvement"],
                15: ["Martial Archetype Feature"],
                16: ["Ability Score Improvement"],
                17: ["Action Surge (2)", "Indomitable (3)"],
                18: ["Martial Archetype Feature"],
                19: ["Ability Score Improvement"],
                20: ["Extra Attack (3)"]
            },
            "Wizard": {
                1: ["Spellcasting", "Arcane Recovery"],
                2: ["Arcane Tradition"],
                3: ["2nd Level Spells"],
                4: ["Ability Score Improvement"],
                5: ["3rd Level Spells"],
                6: ["Arcane Tradition Feature"],
                7: ["4th Level Spells"],
                8: ["Ability Score Improvement"],
                9: ["5th Level Spells"],
                10: ["Arcane Tradition Feature"],
                11: ["6th Level Spells"],
                12: ["Ability Score Improvement"],
                13: ["7th Level Spells"],
                14: ["Arcane Tradition Feature"],
                15: ["8th Level Spells"],
                16: ["Ability Score Improvement"],
                17: ["9th Level Spells"],
                18: ["Spell Mastery"],
                19: ["Ability Score Improvement"],
                20: ["Signature Spells"]
            },
            "Barbarian": {
                1: ["Rage", "Unarmored Defense"],
                2: ["Reckless Attack", "Danger Sense"],
                3: ["Primal Path"],
                4: ["Ability Score Improvement"],
                5: ["Extra Attack", "Fast Movement"],
                6: ["Path Feature"],
                7: ["Feral Instinct"],
                8: ["Ability Score Improvement"],
                9: ["Brutal Critical"],
                10: ["Path Feature"],
                11: ["Relentless Rage"],
                12: ["Ability Score Improvement"],
                13: ["Brutal Critical (2)"],
                14: ["Path Feature"],
                15: ["Persistent Rage"],
                16: ["Ability Score Improvement"],
                17: ["Brutal Critical (3)"],
                18: ["Indomitable Might"],
                19: ["Ability Score Improvement"],
                20: ["Primal Champion"]
            }
        };

        return features[className]?.[level] || [`Level ${level} features (see class description)`];
    }

    async awardExperience(xp: number) {
        if (!this.selectedCharacter || xp <= 0) {
            new Notice('Please enter a valid XP amount.');
            return;
        }

        try {
            const content = await this.app.vault.read(this.selectedCharacter.file);
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            
            if (!frontmatterMatch) return;

            const frontmatter = this.parseSimpleYAML(frontmatterMatch[1]);
            const currentXP = frontmatter.experience || 0;
            const newXP = currentXP + xp;

            const newContent = content.replace(
                /^experience: \d+$/m,
                `experience: ${newXP}`
            );

            await this.app.vault.modify(this.selectedCharacter.file, newContent);
            new Notice(`Awarded ${xp} XP to ${this.selectedCharacter.name}!`);
            
            // Check for level up
            const currentLevel = frontmatter.level || 1;
            const xpForNextLevel = this.plugin.getNextLevelExperience(currentLevel);
            
            if (newXP >= xpForNextLevel && currentLevel < 20) {
                new Notice(`${this.selectedCharacter.name} is ready to level up!`);
            }

            // Refresh display
            const levelUpSection = document.querySelector('.level-up-modal') as HTMLElement;
            if (levelUpSection) {
                await this.displayLevelUpOptions(levelUpSection.querySelector('div[style*="margin-top: 20px"]') as HTMLElement);
            }
        } catch (error) {
            new Notice(`Error awarding XP: ${error.message}`);
        }
    }

    async levelUpCharacter() {
        if (!this.selectedCharacter) return;

        try {
            const content = await this.app.vault.read(this.selectedCharacter.file);
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            
            if (!frontmatterMatch) return;

            const frontmatter = this.parseSimpleYAML(frontmatterMatch[1]);
            const currentLevel = frontmatter.level || 1;
            const newLevel = currentLevel + 1;
            const newXP = this.plugin.getExperienceForLevel(newLevel);

            // Update level and XP
            let newContent = content.replace(
                /^level: \d+$/m,
                `level: ${newLevel}`
            );
            newContent = newContent.replace(
                /^experience: \d+$/m,
                `experience: ${newXP}`
            );

            // Update HP if needed (simplified - just add average)
            const className = frontmatter.class || 'Fighter';
            const classData = DND_DATA.classes[className];
            if (classData) {
                const conMod = this.plugin.calculateAbilityModifier(frontmatter.stats?.constitution || 10);
                const hpIncrease = Math.floor(classData.hitDie / 2) + 1 + conMod;
                const currentMaxHP = frontmatter.hitPoints?.max || 10;
                const newMaxHP = currentMaxHP + hpIncrease;

                newContent = newContent.replace(
                    /^  max: \d+$/m,
                    `  max: ${newMaxHP}`
                );
                newContent = newContent.replace(
                    /^  current: \d+$/m,
                    `  current: ${newMaxHP}` // Assume full heal on level up
                );
            }

            await this.app.vault.modify(this.selectedCharacter.file, newContent);
            new Notice(`🎉 ${this.selectedCharacter.name} leveled up to ${newLevel}!`);
            
            // Refresh display
            const levelUpSection = document.querySelector('.level-up-modal') as HTMLElement;
            if (levelUpSection) {
                await this.displayLevelUpOptions(levelUpSection.querySelector('div[style*="margin-top: 20px"]') as HTMLElement);
            }
        } catch (error) {
            new Notice(`Error leveling up character: ${error.message}`);
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}