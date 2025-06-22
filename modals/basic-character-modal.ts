import { App, Modal, TextComponent, Notice } from 'obsidian';
import CharacterManagerPlugin from '../main';

export class CreateCharacterModal extends Modal {
    plugin: CharacterManagerPlugin;
    nameInput: TextComponent;

    constructor(app: App, plugin: CharacterManagerPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        contentEl.createEl('h2', { text: 'Create New Character (Basic)' });

        const nameContainer = contentEl.createDiv();
        nameContainer.createEl('label', { text: 'Character Name:' });
        this.nameInput = new TextComponent(nameContainer);
        this.nameInput.inputEl.style.width = '100%';
        this.nameInput.inputEl.style.marginTop = '8px';
        this.nameInput.inputEl.placeholder = 'Enter character name...';

        const infoContainer = contentEl.createDiv();
        infoContainer.style.marginTop = '15px';
        infoContainer.style.padding = '10px';
        infoContainer.style.backgroundColor = 'var(--background-secondary)';
        infoContainer.style.borderRadius = '4px';
        infoContainer.style.fontSize = '0.9em';
        infoContainer.innerHTML = `
            <p><strong>Note:</strong> This creates a basic character without D&D mechanics.</p>
            <p>For full D&D 5e characters with stats, spells, and equipment, use <strong>"Create D&D Character"</strong> instead.</p>
        `;

        const buttonContainer = contentEl.createDiv();
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.textAlign = 'right';

        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.style.marginRight = '10px';
        cancelButton.onclick = () => this.close();

        const createButton = buttonContainer.createEl('button', { text: 'Create', cls: 'mod-cta' });
        createButton.onclick = () => this.createCharacter();

        // Focus on name input
        this.nameInput.inputEl.focus();
        
        // Handle Enter key
        this.nameInput.inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.createCharacter();
            }
        });
    }

    async createCharacter() {
        const name = this.nameInput.getValue().trim();
        if (!name) {
            new Notice('Please enter a character name.');
            return;
        }

        // Check if character already exists
        const existingFile = this.app.vault.getAbstractFileByPath(`${this.plugin.settings.charactersFolder}/${name}.md`);
        if (existingFile) {
            new Notice('A character with this name already exists.');
            return;
        }

        await this.plugin.createCharacter(name);
        this.close();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}