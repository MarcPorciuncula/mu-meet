<template>
  <div>
    <h1 class='center header'>MUmeet</h1>
    <!--to be shown: regular user -->
    <p class = 'center text'> your session is hosted by:</p>
    <p class ='center host'>Marc Porciuncula</p>

    <!--to be shown: session host -->
    <p class = 'host center' style='font-size:16px'>Your session code is: <!--CODE--> </p>
    <p class = 'text center'> invite your team by sharing this link: </p>
    <!-- session url in text input -->

<!--
    <ui-select :floating-label="true" label="minimum meeting length"></ui-select>
    <ui-select :floating-label="true" label="search in"> </ui-select> -->

    <div class='sessioncontainer'>
    <div class='membersession'>

    </div>
  </div>
  <div class='center' style='padding-top:30px'>
    <ui-button icon="">Calculate a time</ui-button>
  </div>

  </div>
</template>

<style scoped>
.header {
  padding-top: 15px;
  padding-bottom: 10px;
}
h1 {
    font-size:30px;
    margin-bottom:10px;
}
.center {
  display: flex;
  flex-direction:column;
  align-items: center;
}
.host {
  font-size: 20px;
  margin: 5px;
  color: #90A4AE;
}
/*idk how to do this
.membersession {
  width: 100px;
  length: 100px;
  background-color:black;
}
.membercontainer {
  display:flex;
  flex-direction: column;
  align-items:center;
}
*/
.text {
  font-size: 120%;
  margin: 0px;
}
</style>
