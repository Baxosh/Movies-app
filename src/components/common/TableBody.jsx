import { Component } from 'react'
import _ from 'lodash'

export default class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item)
    return _.get(item, column.path)
  }

  render() {
    const { data, columns } = this.props
    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id || item.genre._id}>
            {columns.map((column) => (
              <td key={column.path || column.label}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }
}
