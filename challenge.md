# Knights Challenge

O desafio Knights visa a construção um sistema cadastro de heróis utilizando as
seguintes tecnologias:

- Vue.js
- NodeJS (Express.js | NestJS)
- MongoDB | Redis

## Requisitos

#### [GET] /knights

Exibe a lista com todos os knights.

#### [GET] /knights?filter=heroes

Exibe uma lista contendo apenas os guerreiros que se tornaram heróis.

#### [POST] /knights

Cria um knight.

#### [GET] /knights/:id

Mostra informações de um knight.

#### [DELETE] /knights/:id

Remove um guerreiro. Esse guerreiro deve entrar no Hall of Heroes.

#### [UPDATE] /knights/:id

Permite alterar o apelido.

## Regras

##### Lista de Knights

A lista deve ter:

- Nome: Nome do knight
- Idade: Anos corridos desde o nascimento
- Armas: Quantidade de armas
- Atributo: Atributo chave do knight
- Ataque: Poder de ataque (Como calcular)
- Exp: Experiência (Como calcular)

## Knight

O Knight deve seguir o esquema abaixo:

```json
{
  "name": "",
  "nickname": "",
  "birthday": "",
  "weapons": [
    {
      "name": "sword",
      "mod": 3,
      "attr": " strength",
      "equipped": true
    }
  ],
  "attributes": {
    "strength": 0,
    "dexterity": 0,
    "constitution": 0,
    "intelligence": 0,
    "wisdom": 0,
    "charisma": 0
  },
  "keyAttribute": "strength"
}
```

## Ataque

O ataque de um knight é dado por:

```
attack = 10 + mod(keyAttr) + equippedWeapon.mod
```

Os valores dos atributos devem ser ajustados seguindo a tabela abaixo.

| Valor | Mod |
| ----- | --- |
| 0-8   | -2  |
| 9-10  | -1  |
| 11-12 | 0   |
| 13-15 | +1  |
| 16-18 | +2  |
| 19-20 | +3  |

## Experiência

Um knight só começa seu treinamento a partir dos 7 anos de idade. Antes disso, sua experiência de combate é 0.

A experiência é dada por:

```
exp = Math.floor((age - 7) \* Math.pow(22, 1.45))
```
