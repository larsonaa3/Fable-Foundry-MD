import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import CharacterManagerPlugin from './main';

export class CharacterManagerSettingTab extends PluginSettingTab {
    plugin: CharacterManagerPlugin;

    constructor(app: App, plugin: CharacterManagerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        // Add custom styles
        const style = containerEl.createEl('style');
        style.textContent = `
            .setting-item-description {
                color: var(--text-muted);
                font-size: 0.9em;
                margin-top: 4px;
            }
            .settings-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 8px;
            }
            .settings-section h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: var(--text-accent);
                border-bottom: 1px solid var(--background-modifier-border);
                padding-bottom: 8px;
            }
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .feature-card {
                padding: 15px;
                background-color: var(--background-secondary);
                border-radius: 6px;
                border-left: 4px solid var(--interactive-accent);
            }
            .feature-card h4 {
                margin: 0 0 8px 0;
                color: var(--text-accent);
            }
            .feature-card p {
                margin: 0;
                font-size: 0.9em;
                color: var(--text-muted);
            }
            .template-editor {
                font-family: var(--font-monospace);
                font-size: 0.9em;
                line-height: 1.4;
            }
            .help-section {
                background-color: var(--background-secondary);
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            }
            .help-section h4 {
                margin-top: 0;
                color: var(--text-accent);
            }
            .help-section ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .help-section li {
                margin: 8px 0;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 15px 0;
            }
            .stat-card {
                text-align: center;
                padding: 15px;
                background-color: var(--background-primary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 6px;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                color: var(--interactive-accent);
                display: block;
            }
            .stat-label {
                font-size: 0.9em;
                color: var(--text-muted);
                margin-top: 5px;
            }
        `;

        containerEl.createEl('h2', { text: 'Character Manager Settings' });

        // Basic Settings Section
        const basicSection = containerEl.createDiv('settings-section');
        basicSection.createEl('h3', { text: '⚙️ Basic Settings' });

        new Setting(basicSection)
            .setName('Characters Folder')
            .setDesc('Folder where character files will be stored')
            .addText(text => text
                .setPlaceholder('Characters')
                .setValue(this.plugin.settings.charactersFolder)
                .onChange(async (value) => {
                    this.plugin.settings.charactersFolder = value || 'Characters';
                    await this.plugin.saveSettings();
                }));

        new Setting(basicSection)
            .setName('Use D&D Template by Default')
            .setDesc('Use the D&D 5e character sheet template for new characters')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useDnDTemplate)
                .onChange(async (value) => {
                    this.plugin.settings.useDnDTemplate = value;
                    await this.plugin.saveSettings();
                }));

        // Template Settings Section
        const templateSection = containerEl.createDiv('settings-section');
        templateSection.createEl('h3', { text: '📝 Template Settings' });

        new Setting(templateSection)
            .setName('Character Template')
            .setDesc('Template used when creating new D&D characters. Supports YAML frontmatter and placeholder variables.')
            .addTextArea(text => {
                text.setPlaceholder('Enter your template...')
                    .setValue(this.plugin.settings.defaultTemplate)
                    .onChange(async (value) => {
                        this.plugin.settings.defaultTemplate = value;
                        await this.plugin.saveSettings();
                    });
                text.inputEl.addClass('template-editor');
                text.inputEl.rows = 20;
                text.inputEl.style.width = '100%';
                text.inputEl.style.height = '400px';
            });

        // Template Variables Help
        const templateHelp = templateSection.createDiv('help-section');
        templateHelp.createEl('h4', { text: '📋 Available Template Variables' });
        templateHelp.createEl('p', { text: 'Use these placeholders in your template. They will be replaced with actual character data:' });

        const variablesList = templateHelp.createEl('div');
        variablesList.style.display = 'grid';
        variablesList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        variablesList.style.gap = '10px';
        variablesList.style.fontSize = '0.85em';

        const variables = [
            '{{name}} - Character name',
            '{{class}} - Character class',
            '{{subclass}} - Character subclass',
            '{{race}} - Character race',
            '{{level}} - Character level',
            '{{strength}} - Strength score',
            '{{dexterity}} - Dexterity score',
            '{{constitution}} - Constitution score',
            '{{intelligence}} - Intelligence score',
            '{{wisdom}} - Wisdom score',
            '{{charisma}} - Charisma score',
            '{{strMod}} - Strength modifier',
            '{{dexMod}} - Dexterity modifier',
            '{{conMod}} - Constitution modifier',
            '{{intMod}} - Intelligence modifier',
            '{{wisMod}} - Wisdom modifier',
            '{{chaMod}} - Charisma modifier',
            '{{maxHP}} - Maximum hit points',
            '{{ac}} - Armor class',
            '{{profBonus}} - Proficiency bonus',
            '{{experience}} - Experience points',
            '{{equipment}} - Equipment list',
            '{{spells}} - Spell list',
            '{{backstory}} - Character backstory'
        ];

        variables.forEach(variable => {
            const item = variablesList.createEl('div');
            item.style.padding = '4px 8px';
            item.style.backgroundColor = 'var(--background-primary)';
            item.style.borderRadius = '4px';
            item.style.fontFamily = 'var(--font-monospace)';
            item.textContent = variable;
        });

        // Management Settings Section
        const managementSection = containerEl.createDiv('settings-section');
        managementSection.createEl('h3', { text: '🔧 Management Tools' });

        new Setting(managementSection)
            .setName('Refresh Character List')
            .setDesc('Reload characters from the characters folder')
            .addButton(button => button
                .setButtonText('🔄 Refresh')
                .setTooltip('Scan for new or modified character files')
                .onClick(async () => {
                    await this.plugin.loadCharacters();
                    new Notice(`Character list refreshed! Found ${this.plugin.characters.length} characters.`);
                }));

        new Setting(managementSection)
            .setName('Reset Template to Default')
            .setDesc('Restore the character template to the default D&D 5e format')
            .addButton(button => button
                .setButtonText('🔄 Reset Template')
                .setWarning()
                .onClick(async () => {
                    if (confirm('Are you sure you want to reset the template? This will overwrite your current template.')) {
                        // Reset to default template
                        const defaultSettings = {
                            charactersFolder: 'Characters',
                            useDnDTemplate: true,
                            defaultTemplate: `---
name: "{{name}}"
class: "{{class}}"
subclass: "{{subclass}}"
race: "{{race}}"
level: {{level}}
experience: {{experience}}
stats:
  strength: {{strength}}
  dexterity: {{dexterity}}
  constitution: {{constitution}}
  intelligence: {{intelligence}}
  wisdom: {{wisdom}}
  charisma: {{charisma}}
---

# {{name}}
*Level {{level}} {{race}} {{class}}*

## Character Summary
**Background:** {{background}}  
**Alignment:** {{alignment}}  
**Experience:** {{experience}} XP

## Ability Scores
| Ability | Score | Modifier |
|---------|-------|----------|
| Strength | {{strength}} | {{strMod}} |
| Dexterity | {{dexterity}} | {{dexMod}} |
| Constitution | {{constitution}} | {{conMod}} |
| Intelligence | {{intelligence}} | {{intMod}} |
| Wisdom | {{wisdom}} | {{wisMod}} |
| Charisma | {{charisma}} | {{chaMod}} |

## Equipment
{{equipment}}

## Spells
{{spells}}

## Character Background
{{backstory}}
`
                        };
                        
                        this.plugin.settings.defaultTemplate = defaultSettings.defaultTemplate;
                        await this.plugin.saveSettings();
                        this.display(); // Refresh the settings display
                        new Notice('Template reset to default!');
                    }
                }));

        // Statistics Section
        const statsSection = containerEl.createDiv('settings-section');
        statsSection.createEl('h3', { text: '📊 Plugin Statistics' });

        const statsGrid = statsSection.createDiv('stats-grid');

        const totalCharacters = statsGrid.createDiv('stat-card');
        totalCharacters.createEl('span', { text: this.plugin.characters.length.toString(), cls: 'stat-number' });
        totalCharacters.createEl('div', { text: 'Total Characters', cls: 'stat-label' });

        const charactersFolder = statsGrid.createDiv('stat-card');
        charactersFolder.createEl('span', { text: this.plugin.settings.charactersFolder, cls: 'stat-number' });
        charactersFolder.createEl('div', { text: 'Characters Folder', cls: 'stat-label' });

        const templateType = statsGrid.createDiv('stat-card');
        templateType.createEl('span', { text: this.plugin.settings.useDnDTemplate ? 'D&D 5e' : 'Basic', cls: 'stat-number' });
        templateType.createEl('div', { text: 'Template Type', cls: 'stat-label' });

        // Features Overview Section
        const featuresSection = containerEl.createDiv('settings-section');
        featuresSection.createEl('h3', { text: '🎲 D&D 5e Features Overview' });

        const featureGrid = featuresSection.createDiv('feature-grid');

        const features = [
            {
                title: '⚔️ Character Creation',
                description: 'Complete D&D 5e character creation with all classes, races, and backgrounds from the 2014 Player\'s Handbook.'
            },
            {
                title: '🎲 Ability Scores',
                description: 'Multiple generation methods: 4d6 drop lowest, point buy, and standard array with automatic modifier calculation.'
            },
            {
                title: '📈 Level Advancement',
                description: 'Experience tracking, automatic level-up features, hit point progression, and class feature notifications.'
            },
            {
                title: '⚔️ Equipment Database',
                description: 'Comprehensive weapon, armor, and adventuring gear database with stats, costs, and properties.'
            },
            {
                title: '✨ Spell System',
                description: 'Spell database with cantrips and 1st level spells, automatic spell slot calculation, and class filtering.'
            },
            {
                title: '📊 Calculations',
                description: 'Automatic spell save DC, attack bonuses, proficiency bonus, saving throws, and combat statistics.'
            },
            {
                title: '📋 YAML Frontmatter',
                description: 'Structured data storage for easy automation, plugin integration, and advanced character management.'
            },
            {
                title: '🔧 Extensible System',
                description: 'Modular design ready for additional features like campaigns, monsters, magic items, and more.'
            }
        ];

        features.forEach(feature => {
            const card = featureGrid.createDiv('feature-card');
            card.createEl('h4', { text: feature.title });
            card.createEl('p', { text: feature.description });
        });

        // Help and Commands Section
        const helpSection = containerEl.createDiv('help-section');
        helpSection.createEl('h4', { text: '💡 Tips & Commands' });
        
        const commandsList = helpSection.createEl('ul');
        commandsList.createEl('li', { text: 'Use Ctrl/Cmd+P → "Create New D&D Character" for full character creation' });
        commandsList.createEl('li', { text: 'Use Ctrl/Cmd+P → "Level Up Character" to advance existing characters' });
        commandsList.createEl('li', { text: 'Click the ribbon icon (👥) for quick access to all features' });
        commandsList.createEl('li', { text: 'Characters are stored as markdown files with YAML frontmatter' });
        commandsList.createEl('li', { text: 'Equipment and spell databases can be accessed via the command palette' });
        commandsList.createEl('li', { text: 'Templates support both static text and dynamic placeholders' });
        
        helpSection.createEl('p', { 
            text: 'For more comprehensive information on using the Character Manager, check the plugin documentation.',
            attr: { style: 'margin-top: 15px; font-style: italic; color: var(--text-muted);' }
        });

        // Version and Credits Section
        const creditsSection = containerEl.createDiv('help-section');
        creditsSection.createEl('h4', { text: '📝 About Character Manager' });
        creditsSection.createEl('p', { text: 'A comprehensive D&D 5e character management system for Obsidian.' });
        creditsSection.createEl('p', { text: 'Features include character creation, advancement tracking, equipment databases, spell management, and more.' });
        creditsSection.createEl('p', { 
            text: 'Compatible with D&D 5e (2014) rules and designed for seamless integration with your Obsidian vault.',
            attr: { style: 'color: var(--text-muted); font-size: 0.9em;' }
        });
    }
}