const d3 = window.d3
const $ = window.$
const formatFloat = formatFloat
const isMobile = isMobile

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20,
}
const barHeight = isMobile ? 40 : 30
const barWidth = '80%'
const duration = 400
const color = d => d._children ? '#F34708' : d.children ? '#FFAA0A' : '#D7DAE1'

let root1
let root2

const tree = d3.layout.tree()
    .nodeSize([0, 20])

const diagonal = d3.svg.diagonal()
    .projection(d => [d.y, d.x])


//Read debt table data
var vm = new Vue({
    el: '#debt',
    data: {
      tableData: []
    },
    delimiters: ['${', '}'],
    created: function(){
      d3.csv('./src/data/money_debt.csv', (data) => {
        $.each(data, function (index,subData) {
          vm.tableData.push(subData);
        })
      })
    }
})

$('table').tablesort()
$('thead th.sortByValue').data('sortBy', function(th, td, tablesort) {
  return Number.parseFloat(td.text());
});

d3.csv('./src/data/money_revenue_106.csv', (data) => {
  const obj = formatData(data)
  d3.select('#svg-annual-income')
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  obj.x0 = 0
  obj.y0 = 0
  update(root1 = obj, 'svg-annual-income', false)
})

d3.csv('./src/data/money_expenditure_106.csv', (data) => {
  const obj = formatData(data)
  d3.select('#svg-annual-expenditure')
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  obj.x0 = 0
  obj.y0 = 0
  update(root2 = obj, 'svg-annual-expenditure')
})

function formatData(data) {
  const obj = {
    name: data[0].name,
    budget_106: data[0].budget_106,
    budget_105: data[0].budget_105,
    final_accounts_104: data[0].final_accounts_104,
    compare_106_105: data[0].compare_106_105,
    children: [],
  }

  let tmpSubject = 0
  for (let i = 1; i < data.length; i++) {
    const dataSubject = parseInt(data[i].subject, 10)

    // Meet next subject
    if (dataSubject === tmpSubject + 1) tmpSubject += 1
    if (dataSubject === tmpSubject) {
      // Subject
      if (!data[i].item) {
        obj.children.push({
          name: data[i].name,
          budget_106: data[i].budget_106,
          budget_105: data[i].budget_105,
          final_accounts_104: data[i].final_accounts_104,
          compare_106_105: data[i].compare_106_105,
          item: dataSubject,
          children: [],
        })
      } else {
        // cuz tmpSubject already++, so we have to subtract two
        obj.children[tmpSubject - 1].children.push({
          name: data[i].name,
          budget_106: data[i].budget_106,
          budget_105: data[i].budget_105,
          final_accounts_104: data[i].final_accounts_104,
          compare_106_105: data[i].compare_106_105,
          item: parseInt(data[i].item, 10),
          children: [],
        })
      }
    }
  }
  return obj
}

function update(source, targetId, start = true) {
  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  // Add id, x, y, depth, x0, y0
  const rootNode = (targetId === 'svg-annual-income') ? root1 : root2
  let nodes = tree.nodes(rootNode)
  const minHeight = 150
  const height = Math.max(minHeight, (nodes.length * barHeight) + margin.top + margin.bottom)

  d3.select(`#${targetId}`).transition()
    .duration(duration)
      .attr('height', start ? minHeight : height)

  // Compute the 'layout'.
  nodes.forEach((d, index) => {
    d.x = index * barHeight
  })
  // When first run, collapse rects
  if (start) {
    nodes[0]._children = nodes[0].children
    nodes[0].children = null
    nodes = [nodes[0]]
  }
  // BUG!!(想要一開始的時候只顯示 depth = 1, 把其他縮合起來)
  // if (start) {
  //   const tmpNodes = [...nodes]
  //   for (let i = 0; i < nodes.length; i++) {
  //     if (tmpNodes[i].depth === 1) {
  //       nodes[i]._children = nodes[i].children
  //       nodes[i].children = null
  //     } else if (tmpNodes[i].depth === 2) {
  //       const index = nodes.indexOf(tmpNodes[i])
  //       console.log(index)
  //       nodes.splice(index, 1)
  //     }
  //   }
  // }

  // Update the nodes while collapse
  const chart = d3.select(`#${targetId} > g`)
  const node = chart.selectAll('g.node')
      .data(nodes, (d, index) => d.id || (d.id = ++index))

  const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', `translate(${source.y0},${source.x0})`)

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append('rect')
      .attr('y', -barHeight / 2)
      .attr('height', barHeight)
      .attr('width', barWidth)
      .attr('class', d => d._children ? 'rect collapse-close' : 'rect')
      .style('fill', color)
      .on('click', function (d) {
        // Copy from children to d._children
        if (d.children) {
          d._children = d.children
          d.children = null
          d3.select(this).attr('class', 'rect collapse-close')
        } else {
          d.children = d._children
          d._children = null
          d3.select(this).attr('class', 'rect')
        }
        update(d, targetId, false)
      })
      .on('mouseenter', updateContent)
      .on('mouseleave', () => {
        $('.detail-container').removeClass('show')
      })

  nodeEnter.append('text')
      .attr('dy', 3.5)
      .attr('dx', 5.5)
      .text(d => {
        if (d.depth === 1) {
          const budget106 = parseFloat(d.budget_106.replace(/,/ig, ''))
          const rootBudget = parseFloat(rootNode.budget_106.replace(/,/ig, ''))
          return `${d.name}(${formatFloat(budget106 / rootBudget * 100, 1)}%): ${d.budget_106}`
        }
        return `${d.name}: ${d.budget_106}`
      })

  nodeEnter.append('text')
    .attr('dy', 3.5)
    .attr('dx', 5.5)
    .attr('class', 'collapse-mark')
    .attr('transform', `translate(${$(`#${targetId}`).width() * .75}, 0)`)
    .style('display', d => (d.depth >= 2) ? 'none' : 'block')
    .text('-')

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y},${d.x})`)

  node.select('.collapse-mark')
    .text(d => (d.children) ? '-' : '+ ')

  node.transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y},${d.x})`)
    .select('rect')
      .style('fill', color)

  // Transition exiting nodes to the parent's new position.(移掉被收起來的點)
  node.exit().transition()
      .duration(duration)
      .attr('transform', `translate(${source.y0},${source.x0})`)
      .remove()

  // Update the links…
  const link = chart.selectAll('path.link')
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', () => {
        const o = {
          x: source.x0,
          y: source.y0,
        }
        return diagonal({ source: o, target: o })
      })
    .transition()
      .duration(duration)
      .attr('d', diagonal)

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr('d', diagonal)

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr('d', () => {
        const o = {
          x: source.x,
          y: source.y,
        }
        return diagonal({ source: o, target: o });
      })
      .remove()

  // Stash the old positions for transition.
  nodes.forEach((d) => {
    d.x0 = d.x
    d.y0 = d.y
  })

  const checkNumber = (n) => {
    if (isNaN(n)) return 0
    // 轉成'億元'
    const tmp = n / 100000
    return (tmp < 0.005) ? `${n / 10} 萬元` : `${formatFloat(tmp, 2)} 億元`
  }
  const turnNumber = (n) => {
    if (isNaN(n)) return 0
    return n / 100000
  }

  const compareNumberColor = (child, parent, $this) => {
    const num = child / parent * 100
    if (num >= 10) {
      $this.addClass('color-red p-size-big')
    } else {
      $this.removeClass('color-red p-size-big')
    }
    return formatFloat(num, 1)
  }

  function updateContent(d) {
    $('.detail-container').addClass('show')

    const numDescSelector = '.ui.bulleted.list .item'
    const randDescIndex = Math.floor(Math.random() * $(numDescSelector).length)
    const DescToShowSelector = `.ui.bulleted.list .item:eq(${randDescIndex})`

    let budget106 = parseFloat(d.budget_106.replace(/,/ig, ''))
    let budget105 = parseFloat(d.budget_105.replace(/,/ig, ''))
    let finalAccounts104 = parseFloat(d.final_accounts_104.replace(/,/ig, ''))
    let compare = parseFloat(d.compare_106_105.replace(/,/ig, '')) / budget105
    let turnBudget106 = turnNumber(budget106)

    // Support content
    const rootBudget = parseFloat(rootNode.budget_106.replace(/,/ig, ''))
    const parentBudget106 = (d.id === 1) ? rootBudget : parseFloat(d.parent.budget_106.replace(/,/ig, ''))
    const childrenNum = (!d._children) ? 0 : d._children.length
    budget106 = isNaN(budget106) ? 0 : budget106

    $('#percentParent').text(compareNumberColor(budget106, parentBudget106, $('#percentParent')))
    $('#percentAll').text(compareNumberColor(budget106, rootBudget, $('#percentAll')))
    $('#children').text(childrenNum)

    $(numDescSelector).hide()
    $(DescToShowSelector).show()

    // Check & format type, then budget will change into string
    budget106 = checkNumber(budget106)
    budget105 = checkNumber(budget105)
    finalAccounts104 = checkNumber(finalAccounts104)
    compare = isNaN(compare) ? 0 : compare

    $('#item').text(d.name)
    $('#budget_106').text(budget106)
    $('#budget_105').text(budget105)
    $('#compare_106_105').text(function () {
      if (compare >= 0) {
        $(this).addClass('positive')
        return `+ ${formatFloat(compare, 2)}%`
      }
      $(this).removeClass('positive')
      return `${formatFloat(compare, 2)}%`
    })
    $('#final_accounts_104').text(finalAccounts104)

    $('#change-drink-num-description').text(function () {
      const drinkPrice = 40
      const turnNum_1 = parseInt((turnBudget106 * (100000000 / drinkPrice)))
      const turnNum_2 = parseInt(turnNum_1 / 10000)
      return (turnNum_2 === 0 )? `${turnNum_1} 杯奶茶` : `${turnNum_2}(萬) 杯奶茶`
    })
    $('#change-wage-num-description').text(function () {
      const minWage = 21009
      const turnMonth = parseInt((turnBudget106 * (100000000 / minWage)))
      const turnYear = parseInt(turnMonth / 12)
      return `${turnYear} 年`
    })
    $('#change-money-num-description').text(function () {
      const thick = 100000 //1 cm
      const hight = parseInt(((turnBudget106 * 100000000) / thick) / 100)
      const floor = parseInt(hight / 3)
      return `${hight} 層樓(3公尺/層)`
    })

  }
}
