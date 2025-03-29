/**
 * Calculadora Profissional - Interface do Usuário
 * Versão atualizada com remoção das funcionalidades de memória
 * 
 * @version 1.0.1
 * @author Nayara Nunes Vieira
 */

// Namespace da UI
const UIManager = (function() {
    // Elementos do DOM
    const operationDisplay = document.getElementById('operationDisplay');
    const resultDisplay = document.getElementById('resultDisplay');
    const calculatorKeys = document.querySelectorAll('.calculator-key');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Inicializar a UI
    function init() {
        console.log('Inicializando UI da calculadora');
        
        // Event listeners para os botões da calculadora
        initializeCalculatorButtons();
        
        // Event listener para suporte a teclado
        initializeKeyboardSupport();
        
        // Remover o overlay de carregamento após um pequeno atraso
        initializeLoadingScreen();
        
        // Atualizar o display com valores iniciais
        updateDisplay(Calculator.getDisplayValues());
    }
    
    // Inicializar botões da calculadora
    function initializeCalculatorButtons() {
        calculatorKeys.forEach(button => {
            button.addEventListener('click', (event) => {
                // Adicionar efeito visual de clique
                addButtonPressEffect(button);
                
                // Processar a ação do botão
                processButtonAction(button);
            });
        });
    }
    
    // Inicializar suporte a teclado
    function initializeKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // Impedir que as teclas numéricas rolem a página
            if (e.key >= '0' && e.key <= '9' || e.key === '.' || 
                e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' ||
                e.key === 'Enter' || e.key === '=' || e.key === 'Escape' ||
                e.key === 'Backspace' || e.key === '%') {
                e.preventDefault();
            }
            
            // Processar a tecla pressionada
            processKeyPress(e.key);
        });
    }
    
    // Inicializar tela de carregamento
    function initializeLoadingScreen() {
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.classList.add('fade-out');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 800);
    }
    
    // Processar ação do botão clicado
    function processButtonAction(button) {
        let displayValues, historyEntry;
        
        if (button.hasAttribute('data-digit')) {
            const digit = button.getAttribute('data-digit');
            if (digit === '.') {
                displayValues = Calculator.handleDecimal();
            } else {
                displayValues = Calculator.handleDigit(digit);
            }
            updateDisplay(displayValues);
        } else if (button.hasAttribute('data-operation')) {
            const op = button.getAttribute('data-operation');
            const result = Calculator.handleOperator(op);
            displayValues = result.result;
            historyEntry = result.historyEntry;
            updateDisplay(displayValues);
            if (historyEntry && typeof HistoryManager !== 'undefined') {
                HistoryManager.addToHistory(historyEntry);
            }
        } else if (button.hasAttribute('data-action')) {
            const action = button.getAttribute('data-action');
            processAction(action, button);
        }
    }
    
    // Processar tecla pressionada
    function processKeyPress(key) {
        // Mapear teclas para ações
        if (key >= '0' && key <= '9') {
            const displayValues = Calculator.handleDigit(key);
            updateDisplay(displayValues);
            highlightKeyButton(`[data-digit="${key}"]`);
        } else if (key === '.') {
            const displayValues = Calculator.handleDecimal();
            updateDisplay(displayValues);
            highlightKeyButton('[data-digit="."]');
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            const result = Calculator.handleOperator(key);
            updateDisplay(result.result);
            if (result.historyEntry && typeof HistoryManager !== 'undefined') {
                HistoryManager.addToHistory(result.historyEntry);
            }
            highlightKeyButton(`[data-operation="${key}"]`);
        } else if (key === 'Enter' || key === '=') {
            const result = Calculator.handleEquals();
            updateDisplay(result.result);
            if (result.historyEntry && typeof HistoryManager !== 'undefined') {
                HistoryManager.addToHistory(result.historyEntry);
            }
            highlightKeyButton('[data-action="equals"]');
        } else if (key === 'Escape') {
            const displayValues = Calculator.handleAllClear();
            updateDisplay(displayValues);
            highlightKeyButton('[data-action="all-clear"]');
        } else if (key === 'Backspace') {
            const displayValues = Calculator.handleClear();
            updateDisplay(displayValues);
            highlightKeyButton('[data-action="clear"]');
        } else if (key === '%') {
            const displayValues = Calculator.handlePercent();
            updateDisplay(displayValues);
            highlightKeyButton('[data-action="percent"]');
        }
    }
    
    // Processar ação específica do botão
    function processAction(action, button) {
        let displayValues, historyEntry;
        
        switch (action) {
            case 'clear':
                displayValues = Calculator.handleClear();
                updateDisplay(displayValues);
                break;
            case 'all-clear':
                displayValues = Calculator.handleAllClear();
                updateDisplay(displayValues);
                break;
            case 'equals':
                const result = Calculator.handleEquals();
                displayValues = result.result;
                historyEntry = result.historyEntry;
                updateDisplay(displayValues);
                if (historyEntry && typeof HistoryManager !== 'undefined') {
                    HistoryManager.addToHistory(historyEntry);
                }
                // Adicionar efeito de destaque ao resultado
                addResultHighlightEffect();
                break;
            case 'sign':
                displayValues = Calculator.handleToggleSign();
                updateDisplay(displayValues);
                break;
            case 'percent':
                displayValues = Calculator.handlePercent();
                updateDisplay(displayValues);
                break;
        }
    }
    
    // Atualizar a exibição da calculadora
    function updateDisplay(displayValues) {
        if (!displayValues) return;
        
        if (operationDisplay) operationDisplay.textContent = displayValues.operation;
        if (resultDisplay) {
            resultDisplay.textContent = displayValues.result;
            
            // Adicionar animação sutil
            resultDisplay.classList.add('animate');
            setTimeout(() => {
                resultDisplay.classList.remove('animate');
            }, 150);
        }
    }
    
    // Definir valor no display (para uso externo)
    function setDisplayValue(value) {
        Calculator.handleClear();
        const displayValues = Calculator.handleDigit(value);
        updateDisplay(displayValues);
    }
    
    // Adicionar efeito de pressionar botão
    function addButtonPressEffect(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    }
    
    // Adicionar efeito de destaque ao resultado
    function addResultHighlightEffect() {
        if (resultDisplay) {
            resultDisplay.classList.add('highlight');
            setTimeout(() => {
                resultDisplay.classList.remove('highlight');
            }, 500);
        }
    }
    
    // Destacar botão correspondente à tecla pressionada
    function highlightKeyButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            addButtonPressEffect(button);
        }
    }
    
    // API pública
    return {
        init,
        updateDisplay,
        setDisplayValue
    };
})();

// Inicializar a UI quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando UIManager');
    UIManager.init();
});