// 上述代码来自 LRU 缓存机制-官方
// 时间复杂度 O(1)，因为 Map 既能保持键值对，还能记住插入顺序。
var LRUCache = function (capacity) {
  this.cache = new Map();
  this.capacity = capacity;
};

LRUCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    // 存在即更新
    let temp = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, temp);
    return temp;
  }
  return -1;
};

LRUCache.prototype.put = function (key, value) {
  if (this.cache.has(key)) {
    // 存在即更新（删除后加入）
    this.cache.delete(key);
  } else if (this.cache.size >= this.capacity) {
    // 不存在即加入
    // 缓存超过最大值，则移除最近没有使用的
    // new Map().keys() 返回一个新的 Iterator 对象
    this.cache.delete(this.cache.keys().next().value);
  }
  this.cache.set(key, value);
};

/**
 * https://leetcode.cn/problems/lru-cache/solution/bu-yong-yu-yan-nei-jian-de-map-gua-dang-feng-zhuan/
 */

class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.hash = {};
    this.count = 0;
    this.dummyHead = new ListNode();
    this.dummyTail = new ListNode();
    this.dummyHead.next = this.dummyTail;
    this.dummyTail.prev = this.dummyHead;
  }

  get(key) {
    let node = this.hash[key];
    if (node == null) return -1;
    this.moveToHead(node);
    return node.value;
  }

  put(key, value) {
    let node = this.hash[key];
    if (node == null) {
      if (this.count == this.capacity) {
        this.removeLRUItem();
      }
      let newNode = new ListNode(key, value);
      this.hash[key] = newNode;
      this.addToHead(newNode);
      this.count++;
    } else {
      node.value = value;
      this.moveToHead(node);
    }
  }

  moveToHead(node) {
    this.removeFromList(node);
    this.addToHead(node);
  }

  removeFromList(node) {
    let temp1 = node.prev;
    let temp2 = node.next;
    temp1.next = temp2;
    temp2.prev = temp1;
  }

  addToHead(node) {
    node.prev = this.dummyHead;
    node.next = this.dummyHead.next;
    this.dummyHead.next.prev = node;
    this.dummyHead.next = node;
  }

  removeLRUItem() {
    let tail = this.popTail();
    delete this.hash[tail.key];
    this.count--;
  }

  popTail() {
    let tail = this.dummyTail.prev;
    this.removeFromList(tail);
    return tail;
  }
}




