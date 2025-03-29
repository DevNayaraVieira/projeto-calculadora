/**
 * Calculadora Profissional - Lógica Principal
 * 
 * Este arquivo contém toda a lógica matemática e operações
 * da calculadora, incluindo cálculos, formatação e memória.
 * 
 * @version 1.0.0
 * @author Seu Nome
 */

// Namespace do aplicativo
const Calculator = (function() {
    // Estado da calculadora
    const state = {
        currentValue: '0',
        previousValue: null,
        currentOperator: null,
        waitingForOperand: false,
        memoryValue: '0',
        lastResult: null
    };

    // Formatar números para exibição
    function formatNumberForDisplay(number) {
        // Converter para string e verificar se é um número válido
        const numStr = String(number);
        if (numStr === 'Infinity' || numStr === 'NaN') return 'Erro';
        
        // Limitar a quantidade de dígitos
        if (numStr.length > 12) {
            // Usar notação científica para números muito grandes
            return parseFloat(numStr).toExponential(7);
        }
        
        return numStr;
    }

    // Realizar cálculo entre dois valores
    function calculate(left, right, operator) {
        left = parseFloat(left);
        right = parseFloat(right);
        
        if (isNaN(left) || isNaN(right)) return '0';
        
        let result;
        switch(operator) {
            case '+':
                result = left + right;
                break;
            case '-':
                result = left - right;
                break;
            case '*':
                result = left * right;
                break;
            case '/':
                if (right === 0) return 'Erro';
                result = left / right;
                break;
            default:
                return right;
        }
        
        // Arredonda para evitar imprecisões de ponto flutuante
        return parseFloat(result.toFixed(10)).toString();
    }

    // Processar entrada de dígito
    function handleDigit(digit) {
        if (state.waitingForOperand) {
            state.currentValue = digit;
            state.waitingForOperand = false;
        } else {
            // Evitar múltiplos zeros no início
            if (state.currentValue === '0' && digit !== '.') {
                state.currentValue = digit;
            } else {
                state.currentValue += digit;
            }
        }
        
        return getDisplayValues();
    }

    // Processar entrada decimal
    function handleDecimal() {
        if (state.waitingForOperand) {
            state.currentValue = '0.';
            state.waitingForOperand = false;
        } else if (state.currentValue.indexOf('.') === -1) {
            state.currentValue += '.';
        }
        
        return getDisplayValues();
    }

    // Processar operador
    function handleOperator(nextOperator) {
        const inputValue = state.currentValue;
        
        // Se não há valor anterior, armazene o atual e aguarde o próximo operando
        if (state.previousValue === null) {
            state.previousValue = inputValue;
            state.waitingForOperand = true;
            state.currentOperator = nextOperator;
            return { 
                result: getDisplayValues(),
                historyEntry: null
            };
        }
        
        // Se já estiver aguardando um operando, apenas altere o operador
        if (state.waitingForOperand) {
            state.currentOperator = nextOperator;
            return { 
                result: getDisplayValues(),
                historyEntry: null
            };
        }
        
        // Calcule o resultado da operação pendente
        const result = calculate(state.previousValue, inputValue, state.currentOperator);
        
        // Crie entrada do histórico
        const opSymbol = getOperatorSymbol(state.currentOperator);
        const equation = `${state.previousValue} ${opSymbol} ${inputValue}`;
        const historyEntry = {
            equation: equation,
            result: result
        };
        
        // Atualize os valores
        state.currentValue = result;
        state.previousValue = result;
        state.waitingForOperand = true;
        state.currentOperator = nextOperator;
        state.lastResult = result;
        
        return { 
            result: getDisplayValues(),
            historyEntry: historyEntry
        };
    }

    // Processar botão de igual
    function handleEquals() {
        // Se não há operação pendente, não faça nada
        if (state.previousValue === null || state.waitingForOperand) {
            return { 
                result: getDisplayValues(),
                historyEntry: null
            };
        }
        
        const inputValue = state.currentValue;
        const result = calculate(state.previousValue, inputValue, state.currentOperator);
        
        // Crie entrada do histórico
        const opSymbol = getOperatorSymbol(state.currentOperator);
        const equation = `${state.previousValue} ${opSymbol} ${inputValue}`;
        const historyEntry = {
            equation: equation,
            result: result
        };
        
        // Atualize os valores
        state.currentValue = result;
        state.previousValue = null;
        state.waitingForOperand = true;
        state.currentOperator = null;
        state.lastResult = result;
        
        return { 
            result: getDisplayValues(),
            historyEntry: historyEntry
        };
    }

    // Limpar entrada atual
    function handleClear() {
        state.currentValue = '0';
        return getDisplayValues();
    }

    // Limpar tudo
    function handleAllClear() {
        state.currentValue = '0';
        state.previousValue = null;
        state.currentOperator = null;
        state.waitingForOperand = false;
        return getDisplayValues();
    }

    // Inverter sinal
    function handleToggleSign() {
        state.currentValue = (parseFloat(state.currentValue) * -1).toString();
        return getDisplayValues();
    }

    // Processar porcentagem
    function handlePercent() {
        const value = parseFloat(state.currentValue);
        state.currentValue = (value / 100).toString();
        return getDisplayValues();
    }

    // Armazenar na memória
    function handleMemoryStore() {
        state.memoryValue = state.currentValue;
    }

    // Adicionar à memória
    function handleMemoryAdd() {
        state.memoryValue = (parseFloat(state.memoryValue) + parseFloat(state.currentValue)).toString();
    }

    // Subtrair da memória
    function handleMemorySubtract() {
        state.memoryValue = (parseFloat(state.memoryValue) - parseFloat(state.currentValue)).toString();
    }

    // Recuperar da memória
    function handleMemoryRecall() {
        state.currentValue = state.memoryValue;
        state.waitingForOperand = false;
        return getDisplayValues();
    }

    // Limpar memória
    function handleMemoryClear() {
        state.memoryValue = '0';
    }

    // Obter valores para exibição
    function getDisplayValues() {
        let operationText = '';
        
        if (state.previousValue !== null) {
            const opSymbol = getOperatorSymbol(state.currentOperator);
            operationText = `${formatNumberForDisplay(state.previousValue)} ${opSymbol}`;
        }
        
        return {
            operation: operationText,
            result: formatNumberForDisplay(state.currentValue)
        };
    }

    // Obter símbolo do operador
    function getOperatorSymbol(operator) {
        switch(operator) {
            case '*': return '×';
            case '/': return '÷';
            default: return operator;
        }
    }

    // API pública
    return {
        handleDigit,
        handleDecimal,
        handleOperator,
        handleEquals,
        handleClear,
        handleAllClear,
        handleToggleSign,
        handlePercent,
        handleMemoryStore,
        handleMemoryAdd,
        handleMemorySubtract,
        handleMemoryRecall,
        handleMemoryClear,
        getDisplayValues,
        getState: () => ({ ...state })
    };
})();
