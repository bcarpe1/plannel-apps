<template>
  <header>
    <table style="border-spacing: 0">
      <tr>
        <td>
          <span style="float:left; padding: 20px;color: white; margin: 0; font-size:32pt;">Plannel Time</span>
          <span style="float:right; padding: 15px">
            <table>
              <tr>
                <td>
                  <span style="float:right;margin: 0"><a href="https://www.buymeacoffee.com/bcarpe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 217px !important;" ></a></span>
                </td>
              </tr>
            </table>
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <div style="width: 865px; padding:10px; margin: 0 20px; border-radius: 5px; background: rgba(256,256,256,0.75); box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.5); font-family:Arial, sans-serif;">
            <span>
              <select v-model="month" class="control" style="margin-right: 10px; width: 140px; text-align: center">
                <option value = 1>January</option>
                <option value = 2>February</option>
                <option value = 3>March</option>
                <option value = 4>April</option>
                <option value = 5>May</option>
                <option value = 6>June</option>
                <option value = 7>July</option>
                <option value = 8>August</option>
                <option value = 9>September</option>
                <option value = 10>October</option>
                <option value = 11>November</option>
                <option value = 12>December</option>
              </select>
              <input class="control" type="number" v-model="year" min="1990" max="9999" style="text-align: center" />
            </span>
          </div>
        </td>
      </tr>
    </table>
  </header>
</template>

<script>
export default {
  name: 'PlannelHeader',
  data() {
    const date = new Date();

    return {
      month: date.getMonth()+1,
      year: date.getFullYear(),
    };
  },
  watch: {
    month(newMonth) {
      this.emitter.emit("changeMonth", {msg: newMonth});
    },
    year(newYear) {
      this.emitter.emit("changeYear", {msg: newYear});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
header {
  background-image: url('~@/assets/Flannel_Loose.png');
  z-index:1; 
  position: fixed; 
  height: 170px; 
  width:100%; 
  margin: 0; 
  box-shadow: 3px 3px 3px 3px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.9);
}
</style>
