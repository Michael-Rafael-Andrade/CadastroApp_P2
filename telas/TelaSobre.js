// telas/TelaSobre.js
// importação
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// exportar função
export function TelaSobre() {
    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Sobre o Sistema</Text>
            <Text style={estilos.subtitulo}>Aplicação desenvolvida por Michael Rafael de Andrade para gestão de cadastro de usuários</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 15,
    },
    subtitulo: {
        fontSize: 18,
        color: '#007bff',
        marginBottom: 5,
    },
    texto:{
        fontSize: 16,
        color: '#666666',
    },
});