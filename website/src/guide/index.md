# Getting Started

**vue-chartjs** is a wrapper for [Chart.js](https://github.com/chartjs/Chart.js) in Vue. You can easily create reuseable chart components.

Supports Chart.js v4.

## Introduction

`vue-chartjs` lets you use Chart.js without much hassle inside Vue. It's perfect for people who need simple charts up and running as fast as possible.

It abstracts the basic logic but exposes the Chart.js object to give you maximal flexibility.

:::tip Need an API to fetch data?
Please consider [Cube](https://cube.dev/?ref=eco-vue-chartjs), an open-source API for data apps.
:::

## Installation

You can install `vue-chartjs` over `yarn` or `npm` or `pnpm`. However, you also need to add `chart.js` as a dependency to your project because `Chart.js` is a peerDependency. This way you can have full control over the versioning of `Chart.js`.

```bash
pnpm add vue-chartjs chart.js
# or
yarn add vue-chartjs chart.js
# or
npm i vue-chartjs chart.js
```

## Integration

Every chart type that is available in Chart.js is exported as a named component and can be imported as such. These components are normal Vue components.

The idea behind vue-chartjs is to provide easy-to-use components, with maximal flexibility and extensibility.

## Creating your first Chart

First, you need to import the base chart.

```javascript
import { Bar } from 'vue-chartjs'
```

Check out the official [Chart.js docs](http://www.chartjs.org/docs/latest/#creating-a-chart) to see the object structure you need to provide.

Just create your own component.

**BarChart.vue**

```vue
<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
```

Use it in your vue app:

**App.vue**

```vue
<template>
  <BarChart />
</template>

<script>
import BarChart from 'path/to/component/BarChart'

export default {
  name: 'App',
  components: { BarChart }
}
</script>
```

## Updating Charts

Since v4 charts have data change watcher and options change watcher by default. Wrapper will update or re-render the chart if new data or new options is passed. Mixins have been removed.

```vue
<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
// DataPage.vue
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  computed: {
      chartData() { return /* mutable chart data */ },
      chartOptions() { return /* mutable chart options */ }
    }
}
</script>
```

## Access to Chart instance

You can get access to chart instance via template refs.

```vue
<template>
  <BarChart ref="bar" />
</template>
```

In Vue3 projects:

```javascript
const chartInstance = this.$refs.bar.chart
```

## Accessibility

To make your charts accessible to all users, you should label your charts.
Please refer also to the official [Chart.js Accessibility notes](https://www.chartjs.org/docs/latest/general/accessibility.html).

### `aria-label`

You can directly label a chart by passing an `aria-label` prop.

```vue
<template>
  <BarChart aria-label="Sales figures for the years 2022 to 2024. Sales in 2022: 987, Sales in 2023: 1209, Sales in 2024: 825." />
</template>
```

### `aria-describedby`

You can reference to a describing element such as a table which describes the data by using the `aria-describedby` property.

```vue
<template>
  <BarChart aria-describedby="my-data-table" />
  <table id="my-data-table">
    <caption>Sales figures for the years 2022 to 2024.</caption>
    <thead>
      <tr>
        <th>2022</th>
        <th>2023</th>
        <th>2024</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>987</td>
        <td>1209</td>
        <td>825</td>
      </tr>
    </tbody>
  </table>
</template>
```

### Fallback-Content

In case the Browser is not able to render the `canvas` element, you should consider providing fallback content by using the Slot of each component.

```vue
<template>
  <BarChart>Chart couldn't be loaded.</BarChart>
</template>
```

## Examples

### Chart with props

Your goal should be to create reusable chart components. For this purpose, you should utilize Vue.js props to pass in chart options and chart data. This way, the parent component itself does not hold an opinion about fetching data and is only for presentation.

```vue
<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
        type: Object,
        required: true
      },
    chartOptions: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
```

### Chart with local data

You can handle your chart data directly in your parent component.

```vue
<template>
  <Bar :data="chartData" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: [ 'January', 'February', 'March'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20, 12]
          }
        ]
      }
    }
  }
}
</script>
```

### Chart with API data

A common pattern is to use an API to retrieve your data. However, there are some things to keep in mind. The most common problem is that you mount your chart component directly and pass in data from an asynchronous API call. The problem with this approach is that Chart.js tries to render your chart and access the chart data synchronously, so your chart mounts before the API data arrives.

To prevent this, a simple `v-if` is the best solution.

Create your chart component with a data prop and options prop, so we can pass in our data and options from a container component.

```vue
<template>
  <div class="container">
    <Bar v-if="loaded" :data="chartData" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data: () => ({
    loaded: false,
    chartData: null
  }),
  async mounted () {
    this.loaded = false

    try {
      const { userlist } = await fetch('/api/userlist')
      this.chartdata = userlist

      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
```

### Chart with dynamic styles

You can set `responsive: true` and pass in a styles object which gets applied as inline styles to the outer `<div>`. This way, you can change the height and width of the outer container dynamically, which is not the default behaviour of Chart.js. It is best to use computed properties for this.

::: warning
 You need to set `position: relative`
:::

```vue
<template>
  <div>
    <Bar :style="myStyles"/>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  computed: {
    myStyles () {
      return {
        height: `${/* mutable height */}px`,
        position: 'relative'
      }
    }
  }
}
</script>
```

### Custom / New Charts

Sometimes you need to extend the default Chart.js charts. There are a lot of [examples](http://www.chartjs.org/docs/latest/developers/charts.html) on how to extend and modify the default charts. Or, you can create your own chart type.

In `vue-chartjs`, you can do this pretty much the same way:

```js
// 1. Import Chart.js so you can use the global Chart object
import { Chart } from 'chart.js'
// 2. Import the `createTypedChart()` method to create the vue component.
import { createTypedChart } from 'vue-chartjs'
// 3. Import needed controller from Chart.js
import { LineController } from 'chart.js'

// 3. Extend one of the default charts
// http://www.chartjs.org/docs/latest/developers/charts.html
class LineWithLineController extends LineController { /* custom magic here */}

// 4. Generate the vue-chartjs component
// The first argument is the chart-id, the second the chart type, third is the custom controller
const CustomLine = createTypedChart('line', LineWithLineController)

// 5. Extend the CustomLine Component just like you do with the default vue-chartjs charts.

export default {
  components: { CustomLine }
}
```

## Resources

Here are some resources, such as tutorials, on how to use `vue-chartjs`:

- [Using vue-chartjs with WordPress](https://medium.com/@apertureless/wordpress-vue-and-chart-js-6b61493e289f)
- [Create stunning Charts with Vue and Chart.js](https://hackernoon.com/creating-stunning-charts-with-vue-js-and-chart-js-28af584adc0a)
- [Let’s Build a Web App with Vue, Chart.js and an API Part I](https://hackernoon.com/lets-build-a-web-app-with-vue-chart-js-and-an-api-544eb81c4b44)
- [Let’s Build a Web App with Vue, Chart.js and an API Part II](https://hackernoon.com/lets-build-a-web-app-with-vue-chart-js-and-an-api-part-ii-39781b1d5acf)
- [Build a realtime chart with VueJS and Pusher](https://blog.pusher.com/build-realtime-chart-with-vuejs-pusher/)
