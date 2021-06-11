exports.up = function(knex) {
    return knex.schema.createTable('palavras', function (table) {
        table.increments();
        table.string('palavra');
        table.string('tipo');
    })
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("palavras")
};