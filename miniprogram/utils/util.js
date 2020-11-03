const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getMRCLevel(mMRC) {
  if (mMRC > 1) {
    return "高风险"
  } else {
    return "低风险"
  }
}

function getCOPDLevel(cat) {
  if (cat > 30) {
    return "非常严重影响"
  } else if (cat > 20)  {
    return "严重影响"
  } else if (cat > 10)  {
    return "中等影响"
  } else  {
    return "轻微影响"
  }
}

function getACTText(act) {
  if(act >= 20) {
    return [1, "哮喘得到良好控制", "根据评估结果，您的病情控制良好，建议遵医嘱按时服药，继续保持。", "#2AC2C3"]
  } else if (act > 15) {
    return [2, "哮喘部分控制", "根据评估结果，您的病情需要密切观察，建议遵医嘱按时服药，定期复诊。", "#EF8C4F"]
  } else {
    return [3, "哮喘未控制", "根据评估结果，您的病情令人担忧，建议尽快到院复诊。", "#D24D4D"]
  }
}

function getCOPDText(mMRC, cat) {
  if(mMRC > 1 || cat > 20) {
    return [3, "根据评估结果，您的病情令人担忧，建议尽快到院复诊。", "#D24D4D"]
  } else if (cat <=10 ) {
    return [1, "根据评估结果，您的病情控制良好，建议遵医嘱按时服药，继续保持。", "#2AC2C3"]
  } else {
    return [2, "根据评估结果，您的病情需要密切观察，建议遵医嘱按时服药，定期复诊。", "#EF8C4F"]
  }
}

module.exports = {
  getMRCLevel: getMRCLevel,
  getCOPDLevel: getCOPDLevel,
  getCOPDText: getCOPDText,
  getACTText: getACTText,
  formatTime: formatTime
}
