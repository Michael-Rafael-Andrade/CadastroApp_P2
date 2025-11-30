// telas/TelaInicio.js
// importação
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';

// função exportar
export function TelaInicio({ navigation }){
    const { theme, toggleTheme } = useTheme();
    return (
        <View style={[estilos.container, { backgroundColor: theme.colors.background}]}>
            <Button
                title="ALTERNAR TEMA"
                onPress={toggleTheme}
                color={theme.colors.primary}
            />
            <Text style={[estilos.titulo, { color: theme.colors.text }]}> Bem-vindo ao APP - Full Stack - Cadastro Fácil de usuários</Text>
            <Text style={[estilos.subtitulo, { color: theme.colors.text }]}>Navegue pelas abas abaixo e gerencie o cadastro de usuários da sua aplicação!</Text>
            <Button
                title="VER USUÁRIOS CADASTRADOS"
                onPress={() => navigation.navigate('Lista')}
                color={theme.colors.primary}
            />
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    subtitulo: {
        fontSize: 16,
        color: '#666666',
    },
});