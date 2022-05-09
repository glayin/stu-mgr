<template>
  <div style="width: 100%; ">
    <a-menu
      id="dddddd"

      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      v-for="(item) in menu" :key="item.url"

    >
      <a-sub-menu
          v-if="item.children"
      >

        <template #title>
          <span>
            <MailOutlined />
            <span>
              {{item.title}}
            </span>
          </span>
        </template>
      </a-sub-menu>

      <a-menu-item @click="to(item.url)" :key="item.url" v-else>
        {{item.title}}
      </a-menu-item>


    </a-menu>
  </div>
</template>

<script src="./index.js"></script>
