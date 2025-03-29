/**
 * Calculadora Profissional - Gerenciamento de Tema
 * 
 * Este arquivo gerencia as funcionalidades relacionadas ao tema
 * da calculadora, incluindo alternância entre claro e escuro,
 * persistência de preferências e configurações iniciais.
 * 
 * @version 1.0.0
 * @author Seu Nome
 */

// Namespace do gerenciador de tema
const ThemeManager = (function() {
    // Elementos do DOM
    const themeToggle = document.getElementById('themeToggle');
    
    // Configurações
    const STORAGE_KEY = 'calculatorTheme';
    const DEFAULT_THEME = 'light';
    
    // Estado atual do tema
    let currentTheme = DEFAULT_THEME;
    
    // Inicializar o módulo
    function init() {
        // Event listener para o botão de alternar tema
        themeToggle.addEventListener('click', toggleTheme);
        
        // Carregar preferência de tema salva ou usar padrão do sistema
        loadThemePreference();
        
        // Aplicar o tema carregado
        applyTheme(currentTheme);
    }
    
    // Alternar entre temas claro e escuro
    function toggleTheme() {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        currentTheme = newTheme;
        
        // Aplicar o novo tema
        applyTheme(newTheme);
        
        // Salvar a preferência do usuário
        saveThemePreference(newTheme);
        
        // Adicionar efeito visual de feedback
        themeToggle.classList.add('pressed');
        setTimeout(() => themeToggle.classList.remove('pressed'), 150);
    }
    
    // Aplicar o tema na interface
    function applyTheme(theme) {
        // Definir o atributo data-theme no documento
        document.documentElement.setAttribute('data-theme', theme);
        
        // Atualizar o ícone do botão de tema
        updateThemeIcon(theme);
        
        // Disparar evento personalizado para outras partes do app
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
    
    // Atualizar o ícone do botão de tema
    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
    
    // Salvar a preferência de tema no localStorage
    function saveThemePreference(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.log('Erro ao salvar preferência de tema:', e);
        }
    }
    
    // Carregar a preferência de tema do localStorage ou usar padrão do sistema
    function loadThemePreference() {
        try {
            // Verificar se há uma preferência salva
            const savedTheme = localStorage.getItem(STORAGE_KEY);
            
            if (savedTheme) {
                // Usar a preferência salva
                currentTheme = savedTheme;
            } else {
                // Verificar preferência do sistema se não houver preferência salva
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                currentTheme = prefersDarkMode ? 'dark' : 'light';
            }
        } catch (e) {
            console.log('Erro ao carregar preferência de tema:', e);
            currentTheme = DEFAULT_THEME;
        }
    }
    
    // Ouvir por mudanças na preferência do sistema
    function listenForSystemPreferenceChanges() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Definir o callback para mudanças na preferência do sistema
        const handleSystemThemeChange = (event) => {
            // Apenas aplicar se o usuário não tiver uma preferência explícita
            if (!localStorage.getItem(STORAGE_KEY)) {
                const systemTheme = event.matches ? 'dark' : 'light';
                currentTheme = systemTheme;
                applyTheme(systemTheme);
            }
        };
        
        // Adicionar o listener (compatível com navegadores mais antigos e modernos)
        if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (darkModeMediaQuery.addListener) {
            // Para navegadores mais antigos
            darkModeMediaQuery.addListener(handleSystemThemeChange);
        }
    }
    
    // API pública
    return {
        init,
        toggleTheme,
        getCurrentTheme: () => currentTheme,
        isDarkMode: () => currentTheme === 'dark'
    };
})();

// Inicializar o módulo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', ThemeManager.init);
