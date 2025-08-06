local mongodb = exports.mongodb

local function await(fn, ...)
    local p = promise.new()

    fn(..., function(err, res)
        if err then
            return p:reject(err)
        end

        p:resolve(res)
    end)

    return Citizen.Await(p)
end

local MongoDB = setmetatable(MongoDB or {}, {
    __index = function(_, index)
        return function(...)
            return mongodb[index](nil, ...)
        end
    end
})

MongoDB.collection = setmetatable({}, {
    __call = function(_, ...)
        local controller = mongodb.collection(nil, ...)

        for method, fn in pairs(controller) do
            controller[method] = setmetatable({
                await = function(...)
                    return await(fn, ...)
                end
            }, {
                __call = function(_, ...)
                    return fn(...)
                end
            })
        end

        return controller
    end
})

local function onReady(cb)
    while GetResourceState('mongodb') ~= 'started' do
        Wait(50)
    end

    mongodb.awaitConnection()

    return cb and cb() or true
end

MongoDB.ready = setmetatable({
    await = onReady
}, {
    __call = function(_, cb)
        Citizen.CreateThreadNow(function() onReady(cb) end)
    end,
})

_ENV.MongoDB = MongoDB