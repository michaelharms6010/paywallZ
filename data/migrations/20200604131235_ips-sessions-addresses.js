
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
  .createTable("sessions", tbl => {
      tbl.increments();
      // tbl.string("ip")
      // .references("ip")
      // .inTable("ips")
      // .onUpdate("CASCADE")
      // .onDelete("CASCADE");
      tbl.string("contentId").notNullable();
      tbl.boolean("paid").defaultTo(false);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("sessions")
  .dropTableIfExists("zaddrs")
  .dropTableIfExists("ips")
};
