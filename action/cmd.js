module.exports = {
async Command(conn, m) {

try {
let usedPrefix
if (typeof m.text !== 'string') m.text = ''
let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {} || {}
let participants = m.isGroup ? groupMetadata.participants : [] || []
let user = m.isGroup ? participants.find(u => u.jid == m.sender) : {} 
let bot = m.isGroup ? participants.find(u => u.jid == conn.user.jid) : {} 
let isBotAdmin = bot.isAdmin || bot.isSuperAdmin || false
let isAdmin = user.isAdmin || user.isSuperAdmin || false // Is User Admin?
let isOwner = userbot['owner'].map(v => v + '@s.whatsapp.net').includes(m.sender) || false
global.dfail = (type, m, conn) => {
let msgnye = {
grup: global.userbot['setting'].group,
admin: global.userbot['setting'].admin,
botAdmin: global.userbot['setting'].botadmin,
user: global.userbot['setting'].jadibot,
owner: global.userbot['setting'].owner,
}[type]
if (msgnye) return m.reply(msgnye)
}

let noPrefix = m.text.replace(global.prefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
args = args || []
let _args = noPrefix.trim().split` `.slice(1)
let text = _args.join` `
commands = (command || '').toLowerCase()

global.data = {
conn,
args,
text,
commands
}
const sender = m.sender.split("@")[0]
if (Public & !m.key.fromMe) return
const button = (Object.keys(m.message)[0] == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : ''
if (m.quoted && m.quoted.sender == conn.user.jid && button) {
console.log("> button response => " + button)
await require("./button.js").execute.call(conn, m, {
this: conn,
text,
args,
button
})
}

for (i in global.Functions) {
type = global.Functions[i]
if (typeof type.functions !== "function") continue
await type.functions.call(conn, m, {
this: conn
})
}

for (i in Events) {
cmd = Events[i]
let custom = cmd.custom
if (!custom) continue
if (m.text.startsWith(cmd.name)) {
if (cmd.admin && !isAdmin) return dfail("admin", m, conn)
if (cmd.owner && !isOwner) return
if (cmd.botAdmin && !isBotAdmin) return dfail("botAdmin", m, conn)
console.log(cmd.name)
await cmd.execute.call(conn, m, data)
}
}
for (let Commands in Events) {
var Accept = Events[Commands]
cmd = Array.isArray(Accept.command) ? Accept.command.some(cmd => cmd === global.command) : global.command.startsWith(Accept.command)
if (!global.command) continue
if (!cmd) continue
if (Accept.admin && !isAdmin) return dfail("admin", m, conn)
if (Accept.owner && !isOwner) return
if (Accept.botAdmin && !isBotAdmin) return dfail("botAdmin", m, conn)
await Accept.execute.call(conn, m, data)
 }
} catch (e) {
console.log(e)
}
}
}
