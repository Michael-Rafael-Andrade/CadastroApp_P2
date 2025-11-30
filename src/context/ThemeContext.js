// src/context/ThemeContext.js
import React, { createContext, useState, useMemo, useContext } from 'react';

// Cria o Contexto
const themeContext = createContext();

// Hook customizado para facilitar o uso do tema em qualquer componente
export const useTheme = () => {
    return useContext(themeContext);
};

// Componente Provedor (Provider)
export const ThemeProvider = ({ children }) => {
    // Definimos o estado para rastrear se o Modo Escuro está ativo
    const [isDarkMode, setIsDarkMode] = useState(false);

    const theme = isDarkMode ? darkTheme : lightTheme;

    // Função para alternar entre os modos
    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    // Usamos useMemo para otimizar: o 'value' só muda se isDarkMode ou toggleTheme mudar
    const themeContextValue = useMemo(() => ({
        isDarkMode,
        toggleTheme,
        theme,
    }), [isDarkMode]);

    return (
        <themeContext.Provider value={themeContextValue}>
            {children}
        </themeContext.Provider>
    );
};

// Tema Claro: Minimalista e Focado no Conteúdo
export const lightTheme = {
    colors: {
        background: '#F5F7FA',  // Fundo principal (uma cor cinza claro suave)
        surface: '#FFFFFF',     // Fundo dos Cards, formulários e barras de navegação (branco puro)
        text: '#333333',        // Cor do texto principal (um cinza escuro, mais suave que preto)
        primary: '#3498DB',     // Cor de destaque (Azul moderno para botões, ícones ativos)
    },
    // Aqui você pode adicionar tipografia, tamanhos de borda, etc.
};

// Tema Escuro: Alto Contraste para Uso Noturno
export const darkTheme = {
    colors: {
        background: '#121212',  // Fundo principal (o preto mais comum em Dark Mode)
        surface: '#1E1E1E',     // Fundo dos Cards e formulários (um cinza escuro para diferenciar da surface)
        text: '#E0E0E0',        // Cor do texto principal (um branco suave)
        primary: '#3498DB',     // Cor de destaque (mantemos o mesmo azul vibrante)
    },
};

