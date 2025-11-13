# Array (Static array)
- Theo cpp, ây là mảng tĩnh, một khi đã cấp phát rồi là KHÔNG thay đổi kích thước được. Muốn thêm, xóa, sửa thì phải tạo một mảng mới với KÍCH THƯỚC mới rồi copy qua.
- Dữ liệu lưu liên tục trên bộ nhớ, khi mà chúng ta cấp phát `arr = []` thì biến arr nó đang lưu là ĐỊA CHỈ của thằng đầu tiên trong vùng nhớ. Cho nên bộ nhớ phải lưu LIÊN TỤC, để khi mà chúng ta gọi `arr[5]` thì nó lấy địa chỉ của thằng đầu tiên + offset là 5 để ra địa chỉ của `arr[5]` là cái chúng ta cần => O(1) cho get và update
- Còn các thao tác insert, delete thì thật ra là copy qua array mới => hình như vẫn là O(N) chỗ này
```
#include <iostream>
using namespace std;

int main() {
    // Khai báo mảng 5 phần tử kiểu int
    int arr[5] = {10, 20, 30, 40, 50};

    // Truy cập phần tử
    cout << "Phần tử đầu tiên: " << arr[0] << endl;
    cout << "Phần tử thứ ba: " << arr[2] << endl;

    // Thay đổi giá trị
    arr[1] = 99;
    cout << "Sau khi đổi arr[1]: " << arr[1] << endl;

    // In toàn bộ mảng
    cout << "Các phần tử trong mảng: ";
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    // Tính số phần tử trong mảng
    int n = sizeof(arr) / sizeof(arr[0]);
    cout << "Số phần tử: " << n << endl;

    return 0;
}
```
# Vector (Dynamic array)
- Nó cũng chính là array luôn nhưng KÍCH THƯỚC KHÔNG GIỚI HẠN. Khi mà nó đầy thì nó sẽ tự cấp thêm vùng nhớ = gấp đôi vùng nhớ hiện tại (quan trọng là phải LIÊN TỤC để get và update là O(1))
- Và bởi vì kích thước nó co giãn được nên chúng ta có thể insert, delete trên vector. Tuy nhiên là O(N). Do muốn delete `vector[5]` đi thì phải dời các thằng `vector[6], vector[7]` đồ qua trái để nó lại liên tục
```
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    v.push_back(4);     // thêm phần tử vào cuối
    v.pop_back();       // xóa phần tử cuối
    v.insert(v.begin(), 0); // chèn 0 vào đầu
    v.erase(v.begin() + 1); // xóa phần tử tại vị trí thứ 1
    v.resize(5, 9);     // thay đổi kích thước lên 5 phần tử, thêm 9 nếu cần
    v.clear();          // xóa toàn bộ phần tử
    v.empty();          // kiểm tra vector rỗng hay không

    cout << "Kích thước: " << v.size() << endl;
    return 0;
}
```
# Linked list
Mỗi phần tử Node sẽ chứa VALUE và POINTER đến phần tử kế tiếp (có thể POINTER đến phần tử đằng trước nữa)

- Singly: Mỗi NODE trỏ 1 chiều
- Doubly: Mỗi NODE trỏ 2 chiều
- Circular: NODE cuối trỏ lại NODE đầu

- Ưu điểm: insert, delete ở head và tail nhanh. Cũng không cần cấp phát trước kích thước (mỗi lần thêm thì nó khởi tạo NODE mới ở đâu đó trong bộ nhớ cũng được rồi dùng POINTER trỏ đến thôi)
- Nhược điểm: truy cập theo chỉ số chậm O(N) (ví dụ lấy NODE thứ 5 ra thì phải duyệt qua 4 NODE đầu rồi mới tới được)
# Stack (LIFO)
Chỉ sử dụng trên đỉnh (top) thôi. Implement nó bằng vector, array
```
#include <iostream>
#include <vector>
using namespace std;

class Stack {
private:
    vector<int> data; // dùng vector để lưu dữ liệu

public:
    void push(int x) {
        data.push_back(x);
    }

    void pop() {
        if (!data.empty())
            data.pop_back();
        else
            cout << "Stack rong!\n";
    }

    int top() {
        if (!data.empty())
            return data.back();
        throw out_of_range("Stack rong!");
    }

    bool empty() {
        return data.empty();
    }

    int size() {
        return data.size();
    }
};

int main() {
    Stack st;
    st.push(5);
    st.push(10);
    st.push(15);

    cout << "Top: " << st.top() << endl; // 15
    st.pop();
    cout << "Top sau khi pop: " << st.top() << endl; // 10
}
```
# Queue (FIFO)
Nó chỉ có 2 phương thức là THÊM VÀO CUỐI (enqueue) và LẤY Ở ĐẦU (dequeue). Xem lại code implement ở dưới bằng array để hiểu (còn implement bằng linked list được nữa):
```
#include <iostream>
using namespace std;

class Queue {
private:
    int arr[100];   // mảng lưu dữ liệu
    int frontIdx;   // vị trí phần tử đầu
    int rearIdx;    // vị trí phần tử cuối
    int size;       // số phần tử hiện có
    int capacity;   // dung lượng tối đa

public:
    Queue(int cap = 100) {
        capacity = cap;
        frontIdx = 0;
        rearIdx = -1;
        size = 0;
    }

    bool isEmpty() {
        return size == 0;
    }

    bool isFull() {
        return size == capacity;
    }

    void enqueue(int x) {
        if (isFull()) {
            cout << "Queue day!\n";
            return;
        }
        rearIdx = (rearIdx + 1) % capacity;
        arr[rearIdx] = x;
        size++;
    }

    void dequeue() {
        if (isEmpty()) {
            cout << "Queue rong!\n";
            return;
        }
        frontIdx = (frontIdx + 1) % capacity;
        size--;
    }

    int front() {
        if (isEmpty()) {
            cout << "Queue rong!\n";
            return -1;
        }
        return arr[frontIdx];
    }

    int getSize() {
        return size;
    }
};

int main() {
    Queue q(5);
    q.enqueue(10);
    q.enqueue(20);
    q.enqueue(30);

    cout << "Phan tu dau: " << q.front() << endl; // 10

    q.dequeue(); // xóa 10
    cout << "Phan tu dau moi: " << q.front() << endl; // 20

    q.enqueue(40);
    q.enqueue(50);
    q.enqueue(60); // Queue đầy nếu vượt 5 phần tử

    cout << "So phan tu hien tai: " << q.getSize() << endl;
}

```
hoặc bằng Linked list
```
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int x) : data(x), next(nullptr) {}
};

class Queue {
private:
    Node* frontNode;
    Node* rearNode;
    int size;

public:
    Queue() {
        frontNode = rearNode = nullptr;
        size = 0;
    }

    bool isEmpty() {
        return frontNode == nullptr;
    }

    void enqueue(int x) {
        Node* newNode = new Node(x);
        if (isEmpty()) {
            frontNode = rearNode = newNode;
        } else {
            rearNode->next = newNode;
            rearNode = newNode;
        }
        size++;
    }

    void dequeue() {
        if (isEmpty()) {
            cout << "Queue rong!\n";
            return;
        }
        Node* temp = frontNode;
        frontNode = frontNode->next;
        delete temp;
        if (frontNode == nullptr)
            rearNode = nullptr; // hàng đợi trống
        size--;
    }

    int front() {
        if (isEmpty()) {
            cout << "Queue rong!\n";
            return -1;
        }
        return frontNode->data;
    }

    int getSize() {
        return size;
    }
};

int main() {
    Queue q;
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);

    cout << "Phan tu dau: " << q.front() << endl; // 1
    q.dequeue();
    cout << "Phan tu dau sau dequeue: " << q.front() << endl; // 2
}
```
# Dequeue (Double-ended Queue)
- Queue là chỉ THÊM Ở CUỐI (enqueue) và XÓA Ở ĐẦU (dequeue). Và chỉ truy cập được phần tử đầu (front)
- Dequeue là THÊM Ở CUỐI, ĐẦU (push_back, push_front) và XÓA Ở ĐẦU, CUỐI (pop_front, pop_back). Truy cập được cả cuối và đầu (front, back)
- Dequeue cũng implement bằng Linked list hoặc Array luôn
# Tree
<mark style="background: #FFF3A3A6;">=> TREE là KHÔNG CÓ CHU TRÌNH (CYCLE) nha. Này là theo định nghĩa luôn á</mark> 
- Số cạnh = Số node - 1 (`E = N - 1`)
- Luôn liên thông: **mọi nút đều có thể đi đến nhau thông qua các cạnh**. Hình như này là theo lý thuyết, còn trong lập trình, để nó liên thông thì phải có thêm POINTER parent trỏ ngược lại cha nữa
- Thường có hướng (cha -> con). Mấy cái pointer đó là hướng rồi đó
```
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    root->left->left = new Node(4);
    root->left->right = new Node(5);

    cout << "Root: " << root->data << endl;
    cout << "Left child of root: " << root->left->data << endl;
}

```
## Binary tree
Mỗi NODE có 2 con, không yêu cầu thứ tự
## Binary search tree
Mỗi NODE có 2 con, nhưng value của left < parent < right 

Tất cả thao tác đều là O(log n). Nhưng nếu cây **suy biến**, thành 1 dãy tăng dần đều (root là bé nhất á) thì O(N)

Code implement Javascript
```
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
```

```
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 🌱 Thêm node mới vào BST
  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return; // không cho phép giá trị trùng
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  // 🔍 Tìm kiếm node trong BST
  search(value) {
    let current = this.root;
    while (current !== null) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  // 🗑️ Xóa node
  remove(value, node = this.root) {
    if (node === null) return null;

    if (value < node.value) {
      node.left = this.remove(value, node.left);
      return node;
    } else if (value > node.value) {
      node.right = this.remove(value, node.right);
      return node;
    } else {
      // Trường hợp 1: không có con
      if (node.left === null && node.right === null) {
        return null;
      }
      // Trường hợp 2: chỉ có 1 con
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;
      // Trường hợp 3: có 2 con
      const minRight = this.findMin(node.right);
      node.value = minRight.value;
      node.right = this.remove(minRight.value, node.right);
      return node;
    }
  }

  // 📉 Tìm node nhỏ nhất
  findMin(node = this.root) {
    while (node.left !== null) node = node.left;
    return node;
  }

  // 🌀 Duyệt cây theo các thứ tự khác nhau
  inorder(node = this.root) {
    if (node !== null) {
      this.inorder(node.left);
      console.log(node.value);
      this.inorder(node.right);
    }
  }

  preorder(node = this.root) {
    if (node !== null) {
      console.log(node.value);
      this.preorder(node.left);
      this.preorder(node.right);
    }
  }

  postorder(node = this.root) {
    if (node !== null) {
      this.postorder(node.left);
      this.postorder(node.right);
      console.log(node.value);
    }
  }
}

```
## AVL, Red Black tree
Độ phức tạp đều là O(logn)
# Tree traversal
      
      A
     / \
    B   C
   / \
  D   E
  
# DFS (depth-first search)
## Pre order
Node -> Left -> Right
```
def preorder(node):
    if node is not None:
        print(node.value)        # N => in giá trị ra đầu tiên
        preorder(node.left)      # L
        preorder(node.right)     # R
```

## In order
Left -> Node -> Right
```
def inorder(node):
    if node is not None:
        inorder(node.left)       # L
        print(node.value)        # N => in giá trị ra giữa
        inorder(node.right)      # R
```

## Post order
Left -> Right -> Node
```
def postorder(node):
    if node is not None:
        postorder(node.left)     # L
        postorder(node.right)    # R
        print(node.value)        # N => in giá trị ra cuối cùng
```

# BFS (breadth-first search)


# Set
## Set
Tập hợp các phần tử **KHÔNG TRÙNG LẶP (luôn UNIQUE)**, CÓ thứ tự. Do nó implement bằng balanced BST (thường là red black tree) nên khi tạo
```
set<int> s = {3, 1, 4};
```
nó sẽ trả về là `{1, 3, 4}`

Xem lại Red Black tree để biết độ phức tạp
## Unordered set
Nó cũng là Set, là tập hợp các phần tử **KHÔNG TRÙNG LẶP (luôn UNIQUE)**, nhưng mà nó **KHÔNG** thứ tự. Nó được implement bằng hash table. Nghĩa là khi tạo:
`unordered_set<int> us = {3, 1, 4, 2};` 
nó sẽ trả về thứ tự ngẫu nhiên trong bộ nhớ (ví dụ: `{4, 2, 3, 1}`)

Dùng hash table để implement, xem lại để biết độ phức tạp
## Multiset
Giống Set, là tập hợp các phần tử **CÓ TRÙNG LẶP (không UNIQUE)**, nhưng mà các phần thử **VẪN CÓ** thứ tự
`multiset<int> ms = {3, 1, 3, 2};`
thì kết quả trả về sẽ là
`{1, 2, 3, 3};`

Cũng dùng Red Black tree để implement, nó có thêm phương thức `.count(value)` để đếm số lần xuất hiện của `value` đó

## So sánh, ví dụ
```
#include <iostream>
#include <set>
#include <unordered_set>
using namespace std;

int main() {
    // ===== 1️⃣ set =====
    set<int> s;
    s.insert(5);
    s.insert(3);
    s.insert(8);
    s.insert(3);  // Bị bỏ qua vì trùng
    cout << "set: ";
    for (int x : s) cout << x << " ";
    cout << endl;

    // ===== 2️⃣ multiset =====
    multiset<int> ms;
    ms.insert(5);
    ms.insert(3);
    ms.insert(8);
    ms.insert(3);  // Giữ lại cả 2
    cout << "multiset: ";
    for (int x : ms) cout << x << " ";
    cout << endl;

    // ===== 3️⃣ unordered_set =====
    unordered_set<int> us;
    us.insert(5);
    us.insert(3);
    us.insert(8);
    us.insert(3);  // Bị bỏ qua
    cout << "unordered_set: ";
    for (int x : us) cout << x << " ";
    cout << endl;

    // ===== 4️⃣ kiểm tra tìm kiếm =====
    int key = 8;
    cout << "\nTìm " << key << ":\n";
    cout << "  set -> " << (s.count(key) ? "tìm thấy" : "không") << endl;
    cout << "  multiset -> " << (ms.count(key) ? "tìm thấy" : "không") << endl;
    cout << "  unordered_set -> " << (us.count(key) ? "tìm thấy" : "không") << endl;
}
```

**KẾT QUẢ**
```
set: 3 5 8             // có thứ tự (tăng dần) và KHÔNG trùng lặp
multiset: 3 3 5 8      // CÓ thứ tự (tăng dần) và CÓ trùng lặp

unordered_set: 8 3 5   // KHÔNG thứ tự (ngẫu nhiên) và KHÔNG trùng lặp
// thứ tự ngẫu nhiên (tùy hash)

Tìm 8:
  set -> tìm thấy
  multiset -> tìm thấy
  unordered_set -> tìm thấy

```

# Map
## Map
- Lưu cặp key-value
- key là duy nhất (unique)
- Tự động sắp xếp theo key (alphabet, tăng dần,...)
Cài bằng Red Black tree
## Unordered map (Dictionary)
- Không có thứ tự
- key là duy nhất
Cài bằng hash table

**Dictionary** có thể bảo toàn thứ tự chèn, nghĩa là chèn `3 1 2` thì nó vẫn như vậy, không có tự sắp xếp lại thành `1 2 3` nhưng cũng không ra kết quả ngẫu nhiên `2 1 3` nhhuw **Unordered map** bình thường

## Multimap
- Giống map nhưng cho phép key trùng
- Dữ liệu vẫn được sắp xếp theo key
Vẫn cài bằng Red Black tree

## Ví dụ
```
#include <iostream>
#include <map>
#include <unordered_map>
using namespace std;

int main() {
    // ===== 1️⃣ map =====
    map<string, int> m;
    m["banana"] = 2;
    m["apple"] = 5;
    m["orange"] = 3;
    m["apple"] = 10;  // ghi đè giá trị cũ

    cout << "map (Red-Black Tree, key duy nhất, sắp xếp theo key):\n";
    for (auto [k, v] : m)
        cout << "  " << k << " -> " << v << endl;

    // ===== 2️⃣ multimap =====
    multimap<string, int> mm;
    mm.insert({"banana", 2});
    mm.insert({"apple", 5});
    mm.insert({"orange", 3});
    mm.insert({"apple", 10});  // giữ lại cả hai

    cout << "\nmultimap (Red-Black Tree, cho phép key trùng, sắp xếp theo key):\n";
    for (auto [k, v] : mm)
        cout << "  " << k << " -> " << v << endl;

    // ===== 3️⃣ unordered_map =====
    unordered_map<string, int> um;
    um["banana"] = 2;
    um["apple"] = 5;
    um["orange"] = 3;
    um["apple"] = 10;  // ghi đè giá trị cũ

    cout << "\nunordered_map (Hash Table, key duy nhất, không sắp xếp):\n";
    for (auto [k, v] : um)
        cout << "  " << k << " -> " << v << endl;
}
```

**Kết quả**
```
map (Red-Black Tree, key duy nhất, sắp xếp theo key):
  apple -> 10
  banana -> 2
  orange -> 3

multimap (Red-Black Tree, cho phép key trùng, sắp xếp theo key):
  apple -> 5
  apple -> 10
  banana -> 2
  orange -> 3

unordered_map (Hash Table, key duy nhất, không sắp xếp):
  orange -> 3
  apple -> 10
  banana -> 2
```

# Heap
Nó là một **complete binaray tree**, tức là các level của cây đều đủ 2 con, trừ level cuối có thể chưa đầy nhưng luôn được dồn sang bên trái (thiếu bên phải, đầy bên trái)
- Max heap: Mỗi node cha có giá trị lớn hơn hoặc bằng với con của nó => phần tử lớn nhất ở root
- Min heap: Mỗi node cha có giá trị nhỏ hơn hoặc bằng với con của nó => phần tử nhỏ nhất ở root

Heap được implement bằng array. Tức là một cây như vậy:
            2
          /           \
        4               5
      /   \           /   \
    9      6        11     7
   / \    / \      /  \
 14  18  19  21   33  17
 
 Nó sẽ duyệt theo bfs ra này:
 ```
 [2,      4, 5,       9, 6, 11, 7,        14, 18, 19, 21, 33, 17]
  0        1  2        3  4   5  6         7   8    9   10  11  12   ← chỉ số i
 ```

Thì ta sẽ có là 
- `left của i là 2i+1`
- `right của i là 2i+2`
- `parent của i là (i-1)//2 (chia, lấy phần nguyên)`

<mark style="background: #BBFABBA6;"><mark style="background: #D2B3FFA6;"><mark style="background: #FF5582A6;"><mark style="background: #FFF3A3A6;"><mark style="background: #ABF7F7A6;">Heap nó chỉ đảm bảo là thằng Min/ Max nó ở trên đầu, chứ không đảm bảo các thằng tầng dưới là theo thứ tự tăng dần hay giảm dần gì nha. Vì vậy khi lấy thằng Min/ Max ra, cần đẩy thằng cuối array lên đầu rồi duyệt xuống dần (heapify) để lấy lại thằng Min/ Max lên trên</mark></mark></mark></mark></mark>

```
class MinHeap:
    def __init__(self):
        self.heap = []

    # Lấy chỉ số cha và con
    def parent(self, i): return (i - 1) // 2
    def left(self, i): return 2 * i + 1
    def right(self, i): return 2 * i + 2

    # Hoán đổi phần tử
    def swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    # Thêm phần tử mới (O(log n))
    def insert(self, val):
        self.heap.append(val)
        i = len(self.heap) - 1
        # Duyệt lên để đảm bảo tính chất min-heap
        while i > 0 and self.heap[self.parent(i)] > self.heap[i]:
            self.swap(i, self.parent(i))
            i = self.parent(i)

    # Lấy phần tử nhỏ nhất (O(1))
    def getMin(self):
        return self.heap[0] if self.heap else None

    # Loại bỏ phần tử nhỏ nhất (O(log n))
    def extractMin(self):
        if not self.heap:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()

        root = self.heap[0]
        self.heap[0] = self.heap.pop()  # Đưa phần tử cuối lên đầu
        self.heapify(0)
        return root

    # Đảm bảo tính chất heap từ nút i trở xuống
    def heapify(self, i): # i là index
        smallest = i
        l, r = self.left(i), self.right(i)

        if l < len(self.heap) and self.heap[l] < self.heap[smallest]:
            smallest = l
        if r < len(self.heap) and self.heap[r] < self.heap[smallest]:
            smallest = r

        if smallest != i:
            self.swap(i, smallest)
            self.heapify(smallest)

```

<mark style="background: #FFF3A3A6;">CẨN THẬN: Min Heap nó chỉ đảm bảo là CHA <= CON trực tiếp của nó thôi. KHÔNG có chuyện các node tầng trên đều <= các node tầng dưới</mark>
            1
           /           \
         3               20
       /   \           /    \
      7     9        21      24
     / \   / \      / \     / \
    8  10 11 14   22 23   25  26

Đây chính là Min heap mà 20 ở tầng 2 **KHÔNG CÓ BÉ HƠN** 7 ở tầng 3

Min heap các bước insert, delete, update đều là O(log n), chỉ có read (mình chỉ cần đọc thằng đầu tiên thôi) là O(1)

# Hash
## Separate chaining
Có một array (bucket) để lưu các linked list. Index của array là hash key.
Ví dụ `int arr[5]` thì hash key là `0, 1, 2, 3, 4`. Mỗi ô đó lưu một linked list.

Nếu value là 15 thì sẽ lưu vào linked list trong ô `15 mod 5 = 0`. Nếu value là 3 thì lưu trong ô `arr[3]`

=> Hàm mod chỉ là một ví dụ cho hash function thôi. 
Có thể có nhiều cách để hash function như là `15^3 mod 5` . Nếu hash function tốt thì các bucket sẽ không bị dồn quá nhiều

	$\text{Load factor}: \alpha = \frac{n}{m}$ với n là tổng số phần tử và m là kích thước mảng
- Hash table gồm `m` **ô (bucket)** — giống như có `m` “ngăn”.
- Ta đang lưu `n` **phần tử** vào các ngăn đó.  
    → `α = n / m` chính là <mark style="background: #ABF7F7A6;">số phần tử trung bình mỗi bucket đang chứa.</mark>
    
- Nếu α nhỏ (≈ 0.5) → bảng còn thưa, ít va chạm.
- Nếu α lớn (>1) → trung bình mỗi bucket chứa >1 phần tử, tức là **nhiều va chạm**.

| Thao tác              | Trung bình      | Tệ nhất | Giải thích                                              |
| --------------------- | --------------- | ------- | ------------------------------------------------------- |
| **Insert**            | O(1)            | O(n)    | Chèn vào **đầu** danh sách (trung bình danh sách ngắn)  |
| **Search**            | O(1 + α) ≈ O(1) | O(n)    | Duyệt danh sách trong bucket                            |
| **Delete**            | O(1 + α) ≈ O(1) | O(n)    | Duyệt danh sách để tìm và xóa                           |
| **Build (n phần tử)** | O(n)            | O(n²)   | Nếu hash xấu → tất cả vào 1 bucket                      |
=> Nếu hash function tốt → các bucket đều ngắn, nên `α` nhỏ (≈ hằng số).

## Open Addressing (dùng mảng & probing)
- Không dùng linked list.
- Nếu va chạm, ta **tìm ô kế tiếp trống** (linear, quadratic, double hashing…).
	- **Linear probing:** i+1, i+2, ...
	- **Quadratic probing:** i + 1², i + 2², ...
	- **Double hashing:** i + j * g(key)

# Sorting
**Bubble, Selection, Insertion** là $O(N^2)$

https://chatgpt.com/c/6914185f-d938-8321-95d3-736576f74ae6

Còn **Merge sort** là $O(N logN)$

**TimSort** là Merge sort nhưng nó không chia ra nhỏ tới mức 1 phần tử 1 mảng mà dừng ở 32 phần tử 1 mảng rồi dùng Insertion sort cho mảng 32 phần tử đó $O(N logN)$

**HeapSort**: build min heap, xong lấy ra Min => rồi heapify rồi lấy ra Min $O(N logN)$

**QuickSort**:  => $O(N logN)$
```
def quick_sort(arr):
    if len(arr) <= 1:
        return arr  # Mảng rỗng hoặc 1 phần tử → đã sắp xếp

    pivot = arr[len(arr) // 2]  # Chọn pivot ở giữa
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)
```
hoặc in-place (không tạo bộ nhớ mới)
```
def quick_sort_inplace(arr, low, high):
    if low < high:
        p = partition(arr, low, high)
        quick_sort_inplace(arr, low, p - 1)
        quick_sort_inplace(arr, p + 1, high)

# sắp xếp lại mảng sao cho tất cả phần tử nhỏ hơn pivot nằm bên trái, lớn hơn nằm bên phải
def partition(arr, low, high):
    pivot = arr[high]  # Chọn pivot là phần tử cuối
    i = low - 1        # Con trỏ của vùng < pivot
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

arr = [10, 7, 8, 9, 1, 5]
quick_sort_inplace(arr, 0, len(arr) - 1)
print(arr)
# Output: [1, 5, 7, 8, 9, 10]
```

# Fibonacci
```
def fib_dp(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

# Tower HaNoi
```
def hanoi(n, A, B, C):
    if n == 1:
        print(f"Di chuyển đĩa 1 từ {A} sang {C}")
    else:
        hanoi(n-1, A, C, B)        # B1
        print(f"Di chuyển đĩa {n} từ {A} sang {C}")  # B2
        hanoi(n-1, B, A, C)        # B3
```