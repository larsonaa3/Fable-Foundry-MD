import { App, Modal } from 'obsidian';
import CharacterManagerPlugin from '../../main';
import { CreateDnDCharacterModal } from './character-creation-modal';
import { CreateCharacterModal } from './basic-character-modal';
import { EquipmentModal } from './equipment-modal';
import { SpellModal } from './spell-modal';
import { LevelUpModal } from './level-up-modal';

export class CharacterListModal extends Modal {
    plugin: CharacterManagerPlugin;

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
            .character-list-modal {
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .button-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                margin-bottom: 20px;
            }
            .character-item {
                padding: 12px;
                border: 1px solid var(--background-modifier-border);
                border-radius: 6px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s;
            }
            .character-item:hover {
                background-color: var(--background-modifier-hover);
            }
            .character-info {
                flex: 1;
                cursor: pointer;
            }
            .character-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
            }
            .character-meta {
                font-size: 0.9em;
                color: var(--text-muted);
            }
            .character-actions {
                display: flex;
                gap: 8px;
            }
            .action-button {
                padding: 4px 8px;
                font-size: 0.85em;
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                background: var(--background-primary);
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .action-button:hover {
                background-color: var(--background-modifier-hover);
            }
            .action-button.danger {
                color: var(--text-error);
                border-color: var(--text-error);
            }
            .action-button.danger:hover {
                background-color: var(--text-error);
                color: var(--text-on-accent);
            }
        `;

        contentEl.addClass('character-list-modal');
        contentEl.createEl('h2', { text: 'Character Manager' });

        // Create character buttons
        const buttonContainer = contentEl.createDiv('button-grid');

        const createDnDButton = buttonContainer.createEl('button', { text: '⚔️ Create D&D Character', cls: 'mod-cta' });
        createDnDButton.onclick = () => {
            this.close();
            new CreateDnDCharacterModal(this.app, this.plugin).open();
        };

        const createBasicButton = buttonContainer.createEl('button', { text: '📝 Create Basic Character' });
        createBasicButton.onclick = () => {
            this.close();
            new CreateCharacterModal(this.app, this.plugin).open();
        };

        const manageEquipmentButton = buttonContainer.createEl('button', { text: '⚔️ Equipment Database' });
        manageEquipmentButton.onclick = () => {
            this.close();
            new EquipmentModal(this.app, this.plugin).open();
        };

        const manageSpellsButton = buttonContainer.createEl('button', { text: '✨ Spell Database' });
        manageSpellsButton.onclick = () => {
            this.close();
            new SpellModal(this.app, this.plugin).open();
        };

        const levelUpButton = buttonContainer.createEl('button', { text: '📈 Level Up Character' });
        levelUpButton.onclick = () => {
            this.close();
            new LevelUpModal(this.app, this.plugin).open();
        };

        // Character list section
        const listSection = contentEl.createDiv();
        listSection.style.marginTop = '30px';

        const listHeader = listSection.createEl('h3', { text: `Your Characters (${this.plugin.characters.length})` });
        listHeader.style.marginBottom = '15px';

        if (this.plugin.characters.length === 0) {
            const emptyState = listSection.createDiv();
            emptyState.style.textAlign = 'center';
            emptyState.style.padding = '40px 20px';
            emptyState.style.color = 'var(--text-muted)';
            
            emptyState.createEl('div', { text: '🎭', attr: { style: 'font-size: 48px; margin-bottom: 16px;' } });
            emptyState.createEl('h3', { text: 'No characters found' });
            emptyState.createEl('p', { text: 'Create your first character to get started!' });
        } else {
            const listContainer = listSection.createDiv();
            listContainer.style.maxHeight = '400px';
            listContainer.style.overflowY = 'auto';

            for (const character of this.plugin.characters) {
                const characterEl = listContainer.createDiv('character-item');

                const characterInfo = characterEl.createDiv('character-info');
                characterInfo.onclick = async () => {
                    await this.app.workspace.getLeaf().openFile(character.file);
                    this.close();
                };

                const nameEl = characterInfo.createDiv('character-name');
                nameEl.textContent = character.name;

                const metaEl = characterInfo.createDiv('character-meta');
                const lastModified = new Date(character.lastModified).toLocaleDateString();
                metaEl.textContent = `Modified: ${lastModified}`;

                const actionsEl = characterEl.createDiv('character-actions');
                
                const editButton = actionsEl.createEl('button', { text: 'Edit', cls: 'action-button' });
                editButton.onclick = async (e) => {
                    e.stopPropagation();
                    await this.app.workspace.getLeaf().openFile(character.file);
                    this.close();
                };

                const deleteButton = actionsEl.createEl('button', { text: 'Delete', cls: 'action-button danger' });
                deleteButton.onclick = async (e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${character.name}"?`)) {
                        await this.plugin.deleteCharacter(character);
                        this.onOpen(); // Refresh the list
                    }
                };
            }

            // Add refresh button at bottom
            const refreshContainer = listSection.createDiv();
            refreshContainer.style.marginTop = '20px';
            refreshContainer.style.textAlign = 'center';

            const refreshButton = refreshContainer.createEl('button', { text: '🔄 Refresh Character List' });
            refreshButton.onclick = async () => {
                await this.plugin.loadCharacters();
                this.onOpen(); // Refresh the display
            };
        }

        // Add footer with tips
        const footer = contentEl.createDiv();
        footer.style.marginTop = '30px';
        footer.style.padding = '15px';
        footer.style.backgroundColor = 'var(--background-secondary)';
        footer.style.borderRadius = '6px';
        footer.style.fontSize = '0.9em';

        footer.createEl('h4', { text: '💡 Tips' });
        const tipsList = footer.createEl('ul');
        tipsList.createEl('li', { text: 'Click character names to open them for editing' });
        tipsList.createEl('li', { text: 'Use the command palette (Ctrl/Cmd+P) for quick access to all features' });
        tipsList.createEl('li', { text: 'D&D characters include full stat blocks and mechanics' });
        tipsList.createEl('li', { text: 'Characters are stored as markdown files in your vault' });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}