# 🦸‍♂️ Aventura do Herói

Um jogo de corrida infinita desenvolvido em JavaScript puro, onde você controla um herói que deve saltar obstáculos, ganhar experiência e evoluir através de diferentes níveis de ranqueamento.

## 🎮 Visão Geral

**Aventura do Herói** é um jogo de plataforma 2D no estilo "endless runner" onde o jogador controla um herói que corre automaticamente e deve pular obstáculos para sobreviver. Cada obstáculo superado concede XP, permitindo que o herói evolua através de um sistema de níveis inspirado em jogos competitivos.

## ✨ Características

### 🎯 Gameplay
- **Controle simples**: Pule com a barra de espaço ou toque na tela
- **Sistema de vidas**: 3 vidas por partida
- **Progressão infinita**: Obstáculos aparecem continuamente
- **Resposta imediata**: Animações fluidas e controles responsivos

### 📊 Sistema de Progressão
- **XP por obstáculo**: +100 XP a cada obstáculo superado
- **8 níveis de ranqueamento**:
  - 🥉 **Ferro** (0 - 1.000 XP)
  - 🥉 **Bronze** (1.001 - 2.000 XP)
  - 🥈 **Prata** (2.001 - 5.000 XP)
  - 🥇 **Ouro** (5.001 - 7.000 XP)
  - 💎 **Platina** (7.001 - 8.000 XP)
  - ⬆️ **Ascendente** (8.001 - 9.000 XP)
  - 👑 **Imortal** (9.001 - 10.000 XP)
  - ✨ **Radiante** (10.001+ XP)

### 🎨 Interface
- **HUD informativo**: Nome do herói, XP atual, nível e vidas
- **Tela de configuração**: Personalize o nome do seu herói
- **Tela de game over**: Estatísticas finais da partida
- **Design responsivo**: Funciona em desktop e mobile

## 🚀 Como Jogar

### Configuração
1. Digite o nome do seu herói na tela inicial
2. Clique em "Iniciar Aventura" ou pressione Enter

### Controles
- **Desktop**: Pressione a barra de **ESPAÇO** para pular
- **Mobile**: Toque na tela para pular

### Objetivo
- Pule sobre os obstáculos marrons que aparecem
- Cada obstáculo superado = +100 XP
- Evolua seu herói através dos níveis de ranqueamento
- Tente alcançar o nível Radiante!

### Fim de Jogo
- Você perde uma vida ao colidir com um obstáculo
- O jogo termina quando todas as 3 vidas acabam
- Sua pontuação final mostra o nível alcançado

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: 
  - Variáveis CSS customizadas
  - Animações e transições suaves
  - Design responsivo com media queries
  - Keyframes para movimento dos elementos
- **JavaScript (ES6+)**:
  - Manipulação do DOM
  - Sistema de eventos
  - Detecção de colisão por bounding boxes
  - Gerenciamento de estado do jogo

## 📁 Estrutura do Projeto

```
aventura-do-heroi/
│
├── index.html          # Estrutura principal do jogo
├── style.css          # Estilos e animações
├── app.js             # Lógica do jogo
└── assets/
    └── img/
        ├── hero-run.gif   # Animação do herói correndo
        └── hero-jump.gif  # Animação do herói pulando
```

## ⚙️ Recursos Técnicos

### Sistema de Colisão
- Detecção baseada em `getBoundingClientRect()`
- Margens de tolerância para melhor jogabilidade
- Verificação contínua a cada 10ms

### Gerenciamento de Estado
- Controle de vidas, XP e nível do herói
- Reset adequado entre partidas
- Limpeza de event listeners e intervalos

### Animações CSS
- **Pulo do herói**: Animação de 0.8s com curva suave
- **Movimento do obstáculo**: Translação da direita para esquerda em 2.5s
- **Transições de tela**: Efeitos hover nos botões

### Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Controle por toque para dispositivos móveis
- Elementos escaláveis com unidades relativas

## 🎯 Melhorias Implementadas

### Correções de Bugs
- ✅ Correção de erro de sintaxe na função de colisão
- ✅ Gerenciamento adequado de event listeners
- ✅ Prevenção de scroll indesejado ao pular
- ✅ Reset completo do estado entre partidas

### Otimizações
- ✅ Detecção de colisão mais precisa
- ✅ Controle de animações melhorado
- ✅ Suporte à tecla Enter na tela inicial
- ✅ Pausa após colisão para melhor feedback

## 🚀 Como Executar

1. **Clone ou baixe** os arquivos do projeto
2. **Organize a estrutura** conforme mostrado acima
3. **Adicione as imagens** do herói na pasta `assets/img/`
4. **Abra o arquivo** `index.html` em um navegador web
5. **Comece a jogar!**

## 🔧 Personalização

### Modificar Níveis
Edite o array `levels` no arquivo `app.js`:
```javascript
const levels = [
    { name: "Novo Nível", minXp: 0, maxXp: 500 },
    // ... adicione mais níveis
];
```

### Ajustar Dificuldade
- **Velocidade do obstáculo**: Modifique a duração da animação `moveObstacle` no CSS
- **XP por obstáculo**: Altere o valor `+= 100` na função `checkCollisionAndScore`
- **Número de vidas**: Modifique `heroLives = 3` no código

### Customizar Visual
- **Cores**: Edite as variáveis CSS em `:root`
- **Tamanhos**: Ajuste `--hero-width`, `--hero-height`, etc.
- **Animações**: Modifique os keyframes no CSS

## 🎨 Assets Recomendados

Para melhor experiência visual, recomenda-se usar:
- **hero-run.gif**: Animação de sprite do herói correndo (80x100px)
- **hero-jump.gif**: Animação de sprite do herói pulando (80x100px)

## 🤝 Contribuição

Este projeto está aberto para melhorias! Algumas ideias:
- 🎵 Adicionar efeitos sonoros
- 🏆 Sistema de high scores
- 🎨 Mais animações e efeitos visuais
- 🌟 Power-ups e habilidades especiais
- 📱 Melhor experiência mobile

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educacionais e pessoais.

---

**Desenvolvido com ❤️ em JavaScript puro**

*Divirta-se jogando e evoluindo seu herói através dos níveis!* 🚀