exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('palavras').del()
    .then(function () {
      // Inserts seed entries
      return knex('palavras').insert([
        { palavra: 'CARRIOLA',      tipo: 'OBJETO'},
        { palavra: 'APITO',         tipo: 'OBJETO'},
        { palavra: 'PRATELEIRA',    tipo: 'OBJETO'},
        { palavra: 'CADEIRA',       tipo: 'OBJETO'},
        { palavra: 'TECLADO',       tipo: 'TECNOLOGIA'},
        { palavra: 'POTE',          tipo: 'OBJETO'},
        { palavra: 'MONITOR',       tipo: 'TECNOLOGIA'},
        { palavra: 'MOUSE',         tipo: 'TECNOLOGIA'},
        { palavra: 'TELEVISOR',     tipo: 'TECNOLOGIA'},
        { palavra: 'CONTROLE',      tipo: 'TECNOLOGIA'},
        { palavra: 'GARRAFA',       tipo: 'OBJETO'},
        { palavra: 'ROTEADOR',      tipo: 'TECNOLOGIA'},
        { palavra: 'RETRATO',       tipo: 'OBJETO'},
        { palavra: 'COMPUTADOR',    tipo: 'TECNOLOGIA'},
        { palavra: 'CELULAR',       tipo: 'TECNOLOGIA'},
        { palavra: 'CABO',          tipo: 'TECNOLOGIA'},
        { palavra: 'ARMAZENAMENTO', tipo: 'TECNOLOGIA'},
        { palavra: 'BOLA',          tipo: 'OBJETO'}
      ]);
    });
};

