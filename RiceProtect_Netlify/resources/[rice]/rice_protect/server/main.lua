CreateThread(function()
    Wait(2000)

    RPWebhook(
        '🛡️ Rice Protect Started',
        'Protection layer initialized.',
        3066993,
        nil,
        {
            {name='Framework', value='`'..Framework.name..'`', inline=true},
            {name='License', value='`'..tostring(License.valid)..'`', inline=true}
        }
    )
end)

AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local src = source

    if Config.License.Enabled and Config.License.FailClosed and not License.valid then
        setKickReason('Server license is not authorized.')
        CancelEvent()

        RPWebhook(
            '🛑 Connection Blocked',
            'Connection was rejected because the protection license is invalid.',
            15158332,
            src
        )
        return
    end

    if RPPanelPlayer then RPPanelPlayer(src, 'join', '') end

    RPWebhook(
        '🟢 Player Connected',
        'Player connected.',
        5763719,
        src
    )
end)

AddEventHandler('playerDropped', function(reason)
    if RPPanelPlayer then RPPanelPlayer(source, 'leave', reason) end
    RPWebhook(
        '🔴 Player Dropped',
        'Reason: `'..RPEscape(reason)..'`',
        9807270,
        source
    )
end)
