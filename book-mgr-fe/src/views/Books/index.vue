<template>
  <div>
    <a-card>
      <h2>图书列表</h2>
      <a-divider/>

      <space-between>
        <div class="search">
          <a-input-search placeholder="根据书名搜索" enter-button/>


        </div>
           <a-button>添加一条</a-button>
      </space-between>
      <a-table :columns="columns" :data-source="data">

      </a-table>

    </a-card>

    <add-one />
  </div>
</template>

<script src = "./index.js"></script>
<style lang="scss">
  @import "./index.scss";
</style>
