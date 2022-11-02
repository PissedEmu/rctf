exports.up = pgm => {
  pgm.addColumns('users', {
    discord_id: { type: 'string', unique: true, notNull: false }
  })
  pgm.addColumns('users', {
    ctftime_id: { type: 'string', unique: true, notNull: false }
  })
  pgm.alterColumn('users', 'email', { notNull: false })
  pgm.addConstraint('users', 'require_email_or_discord_id_or_ctftime_id', 'check ((email is not null) or (discord_id is not null) or (ctftime_id is not null))')
}

exports.down = pgm => {
  pgm.dropConstraint('users', 'require_email_or_discord_id_or_ctftime_id')
  pgm.alterColumn('users', 'email', { notNull: true })
  pgm.dropColumns('users', ['discord_id'])
  pgm.dropColumns('users', ['ctftime_id'])
}
