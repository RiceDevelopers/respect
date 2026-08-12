local function fieldsFor(src, extra)
    local f = {}

    if src then
        local id = RPIdentifiers(src)
        f = {
            {name='Name', value=RPEscape(id.name), inline=true},
            {name='Server ID', value=RPEscape(id.source), inline=true},
            {name='Discord', value=id.discord and ('<@'..id.discord..'>') or 'Unavailable', inline=true},
            {name='FiveM', value=id.fivem and ('`'..RPEscape(id.fivem)..'`') or 'Unavailable', inline=false},
            {name='License', value=id.license and ('`'..RPEscape(id.license)..'`') or 'Unavailable', inline=false},
            {name='License2', value=id.license2 and ('`'..RPEscape(id.license2)..'`') or 'Unavailable', inline=false},
            {name='Steam', value=id.steam and ('`'..RPEscape(id.steam)..'`') or 'Unavailable', inline=false},
            {name='IP', value=id.ip and ('`'..RPEscape(id.ip)..'`') or 'Unavailable', inline=false},
        }
    end

    if extra then
        for _, x in ipairs(extra) do
            f[#f+1] = x
        end
    end

    return f
end

function RPWebhook(title, description, color, src, extra)
    if not Config.Webhook or Config.Webhook == '' then return end

    local payload = {
        username = 'Rice Protect',
        embeds = {{
            title = title,
            description = description or '',
            color = color or 15158332,
            fields = fieldsFor(src, extra),
            footer = {text = Config.Product},
            timestamp = os.date('!%Y-%m-%dT%H:%M:%SZ')
        }}
    }

    PerformHttpRequest(
        Config.Webhook,
        function() end,
        'POST',
        json.encode(payload),
        {['Content-Type']='application/json'}
    )
end
