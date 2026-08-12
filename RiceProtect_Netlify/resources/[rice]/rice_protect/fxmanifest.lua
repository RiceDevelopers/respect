version '3.0.0'

fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Rice'
description 'Rice Protect Ultimate'


server_scripts {
    'config.lua',
    'server/util.lua',
    'server/framework.lua',
    'server/identifiers.lua',
    'server/webhook.lua',
    'server/panel.lua',
    'server/license.lua',
    'server/integrity.lua',
    'server/security.lua',
    'server/main.lua'
}

client_script 'client/main.lua'
