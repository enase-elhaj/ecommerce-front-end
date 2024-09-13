const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  padding: 8,
  border: "1px solid #ddd",
}

const tableCellStyle = {
  padding: 8,
  border: "1px solid #ddd",
  color: "blue",
}

export default function Mainx() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20, fontSize: 20 }}>Page List</h1>
      <table style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>URL</th>
            <th style={tableHeaderStyle}>Page</th>
          </tr>
        </thead>
        <tbody>
<tr>
            <td style={tableCellStyle}><a href='/CartOverlay'>/CartOverlay</a></td>
            <td style={tableCellStyle}><a href='/CartOverlay'>Cart Overlay</a></td>
          </tr>
<tr>
            <td style={tableCellStyle}><a href='/Category'>/Category</a></td>
            <td style={tableCellStyle}><a href='/Category'>Category</a></td>
          </tr>
<tr>
            <td style={tableCellStyle}><a href='/Pdp'>/Pdp</a></td>
            <td style={tableCellStyle}><a href='/Pdp'>PDP</a></td>
          </tr>
<tr>
            <td style={tableCellStyle}><a href='/ProjectCover'>/ProjectCover</a></td>
            <td style={tableCellStyle}><a href='/ProjectCover'>Project Cover</a></td>
          </tr>
</tbody>
      </table>
    </div>
  );
}