// telas/TelaCadastro.js
// importação
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importaremos esta biblioteca para formatação de data e cpf para o formatato escolhido como padrão.
// Para isto vou instalar um pacote para auxiliar na formatação da mascara que usarei no meu projeto. 
// npm install react-native-mask-input
import MaskInput, { Masks } from 'react-native-mask-input';



// exporta a função
export function TelaCadastro() {
    //Definir estado inicial 
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');


    const getUsuarios = async () => {
        try {
            const jsonUsuarios = await AsyncStorage.getItem('USUARIOS_CADASTRADOS');
            // Se houver dados, retorna a lista parseada, senão, retorna um array vazio
            return jsonUsuarios != null ? JSON.parse(jsonUsuarios) : [];
        } catch (erro) {
            console.error("Erro ao buscar usuários: ", erro);
            return [];
        }
    };

    // função para tratar o cadastro
    const handleCadastrar = async () => {
        // validação simples
        if (!nome || !cpf || !dataNascimento || !endereco || !telefone) {
            alert("Preencha todos os campos antes de cadastrar!");
            return;
        }

        // Gerar um ID único - simples (Timestamp)
        const novoId = Date.now().toString();

        // Criar o objeto do novo usuário
        const novoUsuario = {
            id: novoId,
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento,
            endereco: endereco,
            telefone: telefone,
        };

        try {
            // Bucar a lista atual de usuários
            const listaAtual = await getUsuarios();

            // Adicionar o novo usuário na lista ou à lista
            listaAtual.push(novoUsuario);

            // Salvar a lista atualizada no AsyncStorage (convertendo para string)
            await AsyncStorage.setItem('USUARIOS_CADASTRADOS', JSON.stringify(listaAtual));

            alert('Usuário cadastrado com sucesso!');

            // Limpar o formulário
            // Limpar o formulário
            setNome('');
            setCpf('');
            setDataNascimento('');
            setEndereco('');
            setTelefone('');

        } catch (erro){
            console.error('Erro ao salvar o usuário: ', erro);
            alert('Falha ao salvar o usuário. Tente novamente. ');
        }

        // Não irei mais precisar deste trecho de código.
        // console.log('--- Dados do Novo Usuário ---');
        // console.log('Nome: ', nome);
        // console.log('CPF: ', cpf);
        // console.log('Data de nascimento: ', dataNascimento);
        // console.log('Endereco: ', endereco);
        // console.log('Telefone: ', telefone);

    };

    return (
        <ScrollView style={estilos.container}>
            <Text style={estilos.titulo}>Cadastro de Novo Usuário</Text>

            <Text style={estilos.rotulo}>Nome Completo:</Text>
            <TextInput
                style={estilos.entrada}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite o nome"
            />

            <Text style={estilos.rotulo}>CPF:</Text>
            <MaskInput
                style={estilos.entrada}
                value={cpf}
                onChangeText={(masked, unmasked) => setCpf(masked)}
                mask={Masks.CPF}
                keyboardType="numeric"
                placeholder="000.000.000-00"
            />

            <Text style={estilos.rotulo}>Data de Nascimento (DD/MM/AAAA):</Text>
            <MaskInput
                style={estilos.entrada}
                value={dataNascimento}
                onChangeText={(masked, unmasked) => setDataNascimento(masked)}
                mask={MaskInput.DATE_DDMMYYYY}
            />

            <Text style={estilos.rotulo}>Endereço:</Text>
            <TextInput
                style={estilos.entrada}
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Rua, número, bairro"
            />

            <Text style={estilos.rotulo}>Telefone:</Text>
            <MaskInput
                style={estilos.entrada}
                value={telefone}
                onChangeText={(masked, unmasked) => setTelefone(masked)}
                mask={Masks.BRL_PHONE}
                keyboardType="numeric"
                placeholder="(00) 00000-0000"
            />

            <View style={estilos.botaoContainer}>
                <Button
                    title="CADASTRAR USUÁRIO"
                    onPress={handleCadastrar}
                    color="#28a745" // cor verde
                />
            </View>

        </ScrollView>
    );
}

// Estilos 
const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
        textAlign: 'center',
    },
    rotulo: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: '#555555',
    },
    entrada: {
        height: 45,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    botaoContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
});
