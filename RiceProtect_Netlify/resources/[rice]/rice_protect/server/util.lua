function RPLog(msg)
    print(('^5[Rice Protect]^7 %s'):format(tostring(msg)))
end

function RPEscape(v)
    return tostring(v or 'Unknown'):gsub('`', "'")
end

function RPResourceStarted(name)
    return GetResourceState(name) == 'started'
end
