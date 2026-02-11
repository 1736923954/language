<template>
  <view class="vehicle-settings-page">
    <!-- 状态栏占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 地图区域 -->
    <view class="map-section">
      <view class="map-container">
        <!-- 地图占位图 -->
        <view class="map-placeholder">
          <view class="map-pin">
            <view class="pin-icon">
              <u-icon name="map" size="24" color="#FFC107" />
            </view>
          </view>
        </view>
      </view>

      <!-- 位置输入卡片 -->
      <view class="location-card">
        <view class="location-item location-start">
          <view class="location-dot start-dot"></view>
          <view class="location-line"></view>
          <text class="location-text">我的位置</text>
        </view>
        <view class="location-item location-destination">
          <view class="location-dot destination-dot"></view>
          <view class="location-input-wrapper">
            <text class="location-placeholder">请输入目的地</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 骑行统计区域 -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">268km</text>
        <text class="stat-label">总里程</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">36</text>
        <text class="stat-label">今日骑行里程</text>
      </view>
      <view class="stat-item stat-item-action" @click="handleRideRecord">
        <u-icon name="arrow-right" size="20" color="#FFFFFF" />
        <text class="stat-label">骑行记录</text>
      </view>
    </view>

    <!-- 设置列表区域 -->
    <scroll-view class="settings-section" scroll-y>
      <!-- 蓝牙钥匙 -->
      <view class="setting-item" @click="handleBluetoothKey">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="lock" size="24" color="#FFFFFF" />
          </view>
          <text class="setting-title">蓝牙钥匙</text>
        </view>
        <view class="setting-right">
          <text class="setting-status">开</text>
          <u-icon name="arrow-right" size="18" color="#757575" />
        </view>
      </view>

      <!-- 自动锁车 -->
      <view class="setting-item">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="lock" size="24" color="#FFFFFF" />
          </view>
          <view class="setting-content">
            <text class="setting-title">自动锁车</text>
            <view class="setting-subtitle">
              <text class="subtitle-text">自动锁车时间: </text>
              <text class="subtitle-value" @click.stop="handleAutoLockTime">3分钟</text>
              <u-icon name="arrow-right" size="14" color="#757575" />
            </view>
          </view>
        </view>
        <view class="setting-right">
          <u-switch
            v-model="autoLockEnabled"
            active-color="#FFC107"
            size="20"
            @change="handleAutoLockChange"
          />
        </view>
      </view>

      <!-- 开关机铃声 -->
      <view class="setting-item" @click="handleRingtone">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="lock" size="24" color="#FFFFFF" />
          </view>
          <text class="setting-title">开关机铃声</text>
        </view>
        <view class="setting-right">
          <text class="setting-status">关</text>
          <u-icon name="arrow-right" size="18" color="#757575" />
        </view>
      </view>

      <!-- 电池额定电压设置 -->
      <view class="setting-item" @click="handleBatteryVoltage">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="lock" size="24" color="#FFFFFF" />
          </view>
          <text class="setting-title">电池额定电压设置</text>
        </view>
        <view class="setting-right">
          <text class="setting-value">48V</text>
          <u-icon name="arrow-right" size="18" color="#757575" />
        </view>
      </view>

      <!-- 车辆分享 -->
      <view class="setting-item" @click="handleVehicleShare">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="share" size="24" color="#FFFFFF" />
          </view>
          <text class="setting-title">车辆分享</text>
        </view>
        <view class="setting-right">
          <u-icon name="arrow-right" size="18" color="#757575" />
        </view>
      </view>

      <!-- 关于车辆 -->
      <view class="setting-item" @click="handleAboutVehicle">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="info-circle" size="24" color="#FFFFFF" />
          </view>
          <text class="setting-title">关于车辆</text>
        </view>
        <view class="setting-right">
          <text class="setting-value">New Version</text>
          <u-icon name="arrow-right" size="18" color="#757575" />
        </view>
      </view>

      <!-- 车辆OTA升级 -->
      <view class="setting-item" @click="handleOTAUpgrade">
        <view class="setting-left">
          <view class="setting-icon">
            <u-icon name="arrow-up-circle" size="24" color="#FFFFFF" />
          </view>
          <text class="setting-title">车辆OTA升级</text>
        </view>
        <view class="setting-right">
          <text class="setting-value">xxx</text>
          <u-icon name="arrow-right" size="18" color="#757575" />
        </view>
      </view>
    </scroll-view>

    <u-toast ref="toastRef" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const autoLockEnabled = ref(true);
const toastRef = ref();

onLoad(() => {
  // 页面加载
});

const handleRideRecord = () => {
  uni.showToast({
    title: '骑行记录',
    icon: 'none'
  });
};

const handleBluetoothKey = () => {
  uni.showToast({
    title: '蓝牙钥匙设置',
    icon: 'none'
  });
};

const handleAutoLockChange = (value: boolean) => {
  uni.showToast({
    title: value ? '自动锁车已开启' : '自动锁车已关闭',
    icon: 'success'
  });
};

const handleAutoLockTime = () => {
  uni.showToast({
    title: '设置自动锁车时间',
    icon: 'none'
  });
};

const handleRingtone = () => {
  uni.showToast({
    title: '开关机铃声设置',
    icon: 'none'
  });
};

const handleBatteryVoltage = () => {
  uni.showToast({
    title: '电池额定电压设置',
    icon: 'none'
  });
};

const handleVehicleShare = () => {
  uni.showToast({
    title: '车辆分享',
    icon: 'none'
  });
};

const handleAboutVehicle = () => {
  uni.showToast({
    title: '关于车辆',
    icon: 'none'
  });
};

const handleOTAUpgrade = () => {
  uni.showToast({
    title: '车辆OTA升级',
    icon: 'none'
  });
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.vehicle-settings-page {
  min-height: 100vh;
  background-color: #000000;
  color: #FFFFFF;
}

.status-bar-placeholder {
  height: var(--status-bar-height, 44px);
  background-color: #000000;
}

.map-section {
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: $spacing-lg;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(100, 181, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(100, 181, 246, 0.15) 0%, transparent 50%);
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
  }
}

.map-pin {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.pin-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 193, 7, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFC107;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.location-card {
  position: absolute;
  bottom: -50px;
  left: $spacing-lg;
  right: $spacing-lg;
  background-color: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 20;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.location-item {
  display: flex;
  align-items: center;
  position: relative;
}

.location-start {
  margin-bottom: $spacing-md;
}

.location-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.start-dot {
  background-color: #FFC107;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.2);
}

.destination-dot {
  background-color: #FFC107;
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.2);
}

.location-line {
  position: absolute;
  left: 6px;
  top: 12px;
  width: 2px;
  height: 40px;
  background: repeating-linear-gradient(
    to bottom,
    #FFC107 0px,
    #FFC107 4px,
    transparent 4px,
    transparent 8px
  );
  z-index: 1;
}

.location-text {
  margin-left: $spacing-md;
  font-size: $font-size-md;
  color: #FFFFFF;
}

.location-input-wrapper {
  flex: 1;
  margin-left: $spacing-md;
  background-color: #FFC107;
  border-radius: $radius-lg;
  padding: $spacing-lg $spacing-xl;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.location-placeholder {
  font-size: $font-size-md;
  color: #000000;
  font-weight: $font-weight-semibold;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: $spacing-xl $spacing-lg;
  margin-top: $spacing-2xl;
  margin-bottom: $spacing-lg;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-item-action {
  cursor: pointer;
  flex-direction: row;
  gap: $spacing-xs;
}

.stat-value {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: #FFFFFF;
  margin-bottom: $spacing-xs;
}

.stat-label {
  font-size: $font-size-sm;
  color: #757575;
}

.settings-section {
  flex: 1;
  padding: $spacing-lg;
  padding-bottom: $spacing-4xl;
  max-height: calc(100vh - 600px);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xl;
  margin-bottom: $spacing-sm;
  background-color: #1a1a1a;
  border-radius: $radius-lg;
  transition: all $duration-fast $ease-out;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:active {
    background-color: #2d2d2d;
    transform: scale(0.98);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.setting-left {
  display: flex;
  align-items: center;
  flex: 1;
  gap: $spacing-md;
}

.setting-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: $radius-md;
  flex-shrink: 0;
}

.setting-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.setting-title {
  font-size: $font-size-md;
  color: #FFFFFF;
  font-weight: $font-weight-medium;
}

.setting-subtitle {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.subtitle-text {
  font-size: $font-size-xs;
  color: #757575;
}

.subtitle-value {
  font-size: $font-size-xs;
  color: #FFC107;
  font-weight: $font-weight-medium;
}

.setting-right {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.setting-status {
  font-size: $font-size-md;
  color: #FFFFFF;
}

.setting-value {
  font-size: $font-size-md;
  color: #FFC107;
  font-weight: $font-weight-medium;
}
</style>