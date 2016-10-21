shuffle = (array) ->
  random = array.map(Math.random)
  array.map((e,i) -> [i,e])
    .sort((a, b) -> random[a[0]] - random[b[0]])
    .map((e) -> e[1])

parseUrlParam = ->
  arg = {}
  pair=location.search.substring(1).split('&')
  i = 0
  while pair[i]
    kv = pair[i].split('=')
    arg[kv[0]]=kv[1]
    ++i
  arg

class Slot
  constructor: (@symbols)->
    @state = 0
    @slotHtmlUnit = shuffle(@symbols)
    .map((_) -> "<div class='symbol'><p>#{_.name}</p></div>")
    .join('\n')

    @slotHtml = [@slotHtmlUnit for i in [0...2]].join('')
    $('#roulette-inner').html(@slotHtml)
    #@unitHeight = $(window).width() / 100
    @unitHeight = 10 * 5.0

  stop: ($obj) ->
    return if @state isnt 2 
    slideCount = 10
    time = 400 * slideCount
    $obj.stop(true,true)
    marginTop = parseInt($obj.css("margin-top"), 10)
    marginTop -= @unitHeight * slideCount
    count = Math.floor(marginTop / @unitHeight)
    marginTop = @unitHeight * count
    console.log marginTop
    $obj.animate({"margin-top" : marginTop+"px"}, {'duration' : time, 'easing' : "easeOutElastic", 'complete': () =>
      marginTop = parseInt($obj.css("margin-top"), 10)
      @slotHtml = [@slotHtmlUnit for i in [0...2]].join('')
      $('#roulette-inner').html(@slotHtml)
      marginTop %= (@unitHeight * @symbols.length)
      $obj.css('margin-top', marginTop + 'px')
      @state = 0
    })

  move: ($obj) ->
    return if @state isnt 1
    @slotHtml += @slotHtmlUnit
    $('#roulette-inner').html(@slotHtml)

    time = 25 * @symbols.length
    marginTop = parseInt($obj.css("margin-top"), 10)
    marginTop -= @unitHeight * @symbols.length
    count = Math.floor(marginTop / @unitHeight)
    marginTop = @unitHeight * count
    $obj.animate({"margin-top" : marginTop+"px"}, {
      'duration' : time,
      'easing' : "linear"
      'complete':() => @.move($('#roulette-inner'))
    })

  push: ->
    if @state is 0
      @state = 1
      @.move($('#roulette-inner'))
    else if @state is 1
      @state = 2
      @.stop($('#roulette-inner'))

$ ->
  args = parseUrlParam()
  slot = null
  if args.team? and args.team isnt 'all'
    teamIndex = parseInt(args.team)
    slot = new Slot(data.team[teamIndex])
  else
    teamList = Array.prototype.concat.apply([], data.team)
    slot = new Slot(teamList)

  $(document).keypress((e) ->
    if e.which is 13
      slot.push()
      return false
  )
