import { Game } from "src/game/game";

var game = new Game();

for (var playerState of game.state.players.values()) {
    playerState.cards.push(game.registry.getCard("fireplace")!);
    playerState.cards.push(game.registry.getCard("wood-shipment")!);
    playerState.cards.push(game.registry.getCard("forest")!);
    playerState.cards.push(game.registry.getCard("wood-boilder")!);
}

for (var i = 0; i < 8; i++) {
    for (var [j, player] of game.registry.listPlayers().entries()) {
        if (i % 2 == j % 2) {
            game.selectCard(player, 0);
        }
    }

    game.evaluateTurn();

    console.table([...game.state.players.entries()].map(([player, state]) => ({
        player: player.name,
        points: state.points,
        amount: state.getResource("wood")?.amount,
        production: state.getResource("wood")?.production,
        usage: state.getResource("wood")?.usage,
        cards: state.cards.length,
    })));
}