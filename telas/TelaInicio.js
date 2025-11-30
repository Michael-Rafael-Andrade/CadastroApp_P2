// telas/TelaInicio.js
// importação
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// função exportar
export function TelaInicio(){
    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}> Bem-vindo ao APP - Full Stack - Cadastro Fácil</Text>
            <Text style={estilos.subtitulo}>Navegue pelas abas abaixo.</Text>
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