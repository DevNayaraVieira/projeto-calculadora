/**
 * Calculadora Profissional - Histórico
 * Versão corrigida para garantir que o botão de histórico funcione corretamente
 * 
 * @version 1.0.1
 * @author Nayara Nunes Vieira
 */

// Namespace do histórico
const HistoryManager = (function() {
    // Elementos do DOM
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    const historyToggle = document.getElementById('historyToggle');
    
    // Estado do histórico
    let calculationHistory = [];
    let isHistoryVisible = false;
    
    // Inicializar o módulo
    function init() {
        // Event listener para o botão de toggle do histórico
        if (historyToggle) {
            // Corrigido: Assegura que o event listener é adicionado apenas quando o elemento existe
            historyToggle.addEventListener('click', toggleHistory);
            console.log('Event listener de histórico inicializado');
        } else {
            console.error('Elemento historyToggle não encontrado!');
        }
        
        // Carregar histórico do localStorage, se existir
        loadHistoryFromStorage();
        
        // Atualizar a exibição do histórico
        updateHistoryDisplay();
    }
    
    // Alternar a visibilidade do histórico
    function toggleHistory() {
        console.log('Toggle do histórico acionado');
        isHistoryVisible = !isHistoryVisible;
        
        // Verificar se os elementos existem antes de manipulá-los
        if (historyPanel) {
            historyPanel.classList.toggle('visible', isHistoryVisible);
        }
        
        if (historyToggle) {
            historyToggle.innerHTML = isHistoryVisible ? 
                '<i class="fas fa-eye-slash"></i><span>Ocultar</span>' : 
                '<i class="fas fa-history"></i><span>Histórico</span>';
            
            // Efeito de ripple para feedback visual
            historyToggle.classList.add('pressed');
            setTimeout(() => historyToggle.classList.remove('pressed'), 150);
        }
    }
    
    // Adicionar um novo cálculo ao histórico
    function addToHistory(historyEntry) {
        if (!historyEntry) return;
        
        // Limitar histórico a 5 itens
        if (calculationHistory.length >= 5) {
            calculationHistory.pop();
        }
        
        calculationHistory.unshift(historyEntry);
        updateHistoryDisplay();
        saveHistoryToStorage();
    }
    
    // Atualizar a exibição do histórico na interface
    function updateHistoryDisplay() {
        // Verificar se o elemento existe
        if (!historyList) {
            console.error('Elemento historyList não encontrado!');
            return;
        }
        
        // Limpar a lista
        historyList.innerHTML = '';
        
        if (calculationHistory.length === 0) {
            const li = document.createElement('li');
            li.className = 'empty-history';
            li.innerHTML = '<span class="history-equation">Sem histórico</span>';
            historyList.appendChild(li);
            return;
        }
        
        // Adicionar itens do histórico
        calculationHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.dataset.index = index;
            
            li.innerHTML = `
                <span class="history-equation">${item.equation}</span>
                <span class="history-result">${item.result}</span>
            `;
            
            // Adicionar evento de clique para reuso do resultado
            li.addEventListener('click', () => reuseHistoryItem(index));
            
            historyList.appendChild(li);
        });
    }
    
    // Função para reutilizar um item do histórico
    function reuseHistoryItem(index) {
        const item = calculationHistory[index];
        if (item && typeof UIManager !== 'undefined' && UIManager.setDisplayValue) {
            UIManager.setDisplayValue(item.result);
        } else {
            console.error('UIManager não está disponível ou faltando método setDisplayValue');
        }
    }
    
    // Salvar histórico no localStorage
    function saveHistoryToStorage() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        } catch (e) {
            console.log('Erro ao salvar histórico:', e);
        }
    }
    
    // Carregar histórico do localStorage
    function loadHistoryFromStorage() {
        try {
            const savedHistory = localStorage.getItem('calculatorHistory');
            if (savedHistory) {
                calculationHistory = JSON.parse(savedHistory);
            }
        } catch (e) {
            console.log('Erro ao carregar histórico:', e);
            calculationHistory = [];
        }
    }
    
    // Limpar todo o histórico
    function clearHistory() {
        calculationHistory = [];
        updateHistoryDisplay();
        saveHistoryToStorage();
    }
    
    // API pública
    return {
        init,
        addToHistory,
        toggleHistory,
        clearHistory,
        isVisible: () => isHistoryVisible
    };
})();

// Garantir que o módulo seja inicializado quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando HistoryManager');
    HistoryManager.init();
});

// Função de teste para verificar se o histórico está funcionando
function testHistoryToggle() {
    console.log('Testando toggle de histórico manualmente');
    HistoryManager.toggleHistory();
}