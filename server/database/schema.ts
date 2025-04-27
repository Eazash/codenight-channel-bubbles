import { sql } from 'drizzle-orm'
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const channels = sqliteTable('channels', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
  chatId: text('chat_id'),
  channelUsername: text('channel_username'),
  members: integer('members').notNull().default(1),
  isPrivate: integer('is_private', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, table => ([
  check(
    'has_channel_identifier_check',
    sql`${table.channelUsername} IS NOT NULL OR ${table.chatId} IS NOT NULL`,
  ),
]))
