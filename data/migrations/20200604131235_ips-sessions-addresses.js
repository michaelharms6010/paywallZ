
exports.up = function(knex) {
  return knex.schema.createTable("ips", tbl => {
      tbl.increments();
      tbl.string("ip");
  })
  .createTable("zaddrs", tbl => {
      tbl.increments();
      tbl.string("zaddr").unique().notNullable();
      tbl.boolean("active").defaultTo(false);
  })
  .createTable("txns", tbl => {
    tbl.increments();
    tbl.string("txid").unique().notNullable();
    tbl.string("hash").notNullable()
    .references("hash")
    .inTable("sessions")
    .onUpdate("CASCADE")
    .opnDelete("CASCADE")
  })
  .createTable("sessions", tbl => {
      tbl.increments();
      // tbl.string("ip")
      // .references("ip")
      // .inTable("ips")
      // .onUpdate("CASCADE")
      // .onDelete("CASCADE");
      tbl.string("contentId").notNullable();
      tbl.boolean("paid").defaultTo(false);
      tbl.string("hash").notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("sessions")
  .dropTableIfExists("zaddrs")
  .dropTableIfExists("ips")
};
