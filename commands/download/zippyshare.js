const { Mimetype } = require(baileys)
const _$ = require('cheerio')
const _url = require('url')
const _axios = require('axios')
const _math = require('mathjs')
const GetLink = async (u) => {
        console.log('⏳  ' + `Get Page From : ${u}`)
						const zippy = await _axios({ method: 'GET', url: u }).then(res => res.data).catch(err => false)
						console.log('✅  ' + 'Done')
						const $ = _$.load(zippy)
						if (!$('#dlbutton').length) {
							return { error: true, message: $('#lrbox>div').first().text().trim() }
						}
						console.log('⏳  ' + 'Fetch Link Download...')
						const filename0 = $('title').text()
						const filename = filename0.replace('Zippyshare.com - ', '')
						const url = _url.parse($('.flagen').attr('href'), true)
						const urlori = _url.parse(u)
						const key = url.query['key']
						let time;
						let dlurl;
						try {
							time = /var b = ([0-9]+);$/gm.exec($('#dlbutton').next().html())[1]
							dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (2 + 2 * 2 + parseInt(time)) + '3/DOWNLOAD'
						} catch (error) {
							time = _math.evaluate(/ \+ \((.*)\) \+ /gm.exec($('#dlbutton').next().html())[1])
							dlurl = urlori.protocol + '//' + urlori.hostname + '/d/' + key + '/' + (time) + '/DOWNLOAD'
						}
						console.log('✅  ' + 'Done')
						return { error: false, url: dlurl, name: filename }
					}
module.exports = {
name: "zippyshare",
command: ["zippydl"],
type: ["download"],
description: "download zippyshare file",
utilisation: userbot.prefix + "zippyshare",
execute: async(m, {conn, text}) => {
if (!text) return m.reply('Mohon isi parameter url\n\nContoh : _'+userbot.prefix+'zippy https://www17.zippyshare.com/v/ZLbrdeY6/file.html_')
if (!text.includes('zippyshare.com')) return m.reply('Url Bukan zippy!')
console.log(text)
const getLink_zippy = await GetLink(text)
if(getLink_zippy.error) return m.reply(`ERROR!\n\nErr : ${getLink_zippy.message}`)
try {
console.log('Download & Uploading to Whatsapp...')
await conn.sendMessage(m.chat, { url: getLink_zippy.url }, mediaType.document, { mimetype: Mimetype.mp4, filename: getLink_zippy.name })
} catch (err) {
conn.sendMessage(m.chat, `Gagal mengirim file\nMungkin size file melebihi limit Whatsapp`)
console.log(err)
}
}
}


					
