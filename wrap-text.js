// This function was imported and modified from [here] (https://gist.github.com/mbostock/7555321#file-index-html-L93)

function wrapText(text, width) {
  text.each(function () {
    let text = d3.select(this),
      words = text.text().replace(/-/g, "- ").split(/\s+/).reverse(),
      wordsLength = words.length,
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 0.6, // ems
      x = text.attr('x'),
      y = text.attr('y'),
      dy = 0.32,
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em')

    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(' '))

      if (tspan.node().getComputedTextLength() > width && line.length > 1 && wordsLength > 1) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word)
      }
    }
  })
}
