// App.js
// importação
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // posso ou não usar icones para melhorar o design.

// importar as telas criadas
import { TelaInicio } from './telas/TelaInicio';
import { TelaSobre } from './telas/TelaSobre';
import { TelaCadastro } from './telas/TelaCadastro';
import { TelaListaUsuarios } from './telas/TelaListaUsuarios';
import { TelaEdicaoUsuario } from './telas/TelaEdicaoUsuario';

// Criar os navegadores
const NavegadorTabs = createBottomTabNavigator();
const NavegadorStack = createNativeStackNavigator();

/* Criar o componente que irá definir as abas (bottom tabs) */
function NavegacaoAbas() {
  return (
    <NavegadorTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Sobre') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Lista'){
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Cadastro'){
            iconName = focused ? 'person-add' : 'person-add-outline';
          }


          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <NavegadorTabs.Screen
        name="Início"
        component={TelaInicio}
        options={{ title: 'Início' }}
      />
      <NavegadorTabs.Screen
        name="Sobre"
        component={TelaSobre}
        options={{ title: 'Sobre o App' }}
      />

      {/* tela de cadastro fixa. */}
      <NavegadorTabs.Screen
        name="Cadastro"
        component={TelaCadastro}
        options={{
          title: 'Cadastrar', tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add" size={size} color={color} />
          )
        }}
      />

      <NavegadorTabs.Screen
        name="Lista"
        component={TelaListaUsuarios}
        options={{
          title: 'Usuários', tabBarIcon: ({ color, size }) => (<Ionicons name="list" size={size} color={color} />

          )
        }}
      />


    </NavegadorTabs.Navigator>
  );
}


{/* Componente principal que define a pilha de telas (Stack) */ }
function NavegacaoPrincipal() {
  return (
    <NavegadorStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007bff' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* A navegação por abas é a primeira tela da pilha (Stack) */}
      <NavegadorStack.Screen
        name="Principal"
        component={NavegacaoAbas}
        options={{ title: 'Cadastro de Usuários' }}
      />

      {/* Edição na Stack */}
      <NavegadorStack.Screen
        name="Edicao"
        component={TelaEdicaoUsuario}
        options={{ title: 'Editar Usuário' }}
      />



    </NavegadorStack.Navigator>
  );
}

{/* A função principal que exporta nosso app */ }
export default function FuncaoPrincipal() {
  return (
    <NavigationContainer>
      <NavegacaoPrincipal />
    </NavigationContainer>
  );
}