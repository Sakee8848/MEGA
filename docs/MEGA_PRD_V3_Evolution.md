# MEGA: AI-Driven Insurance Broker OS - PRD & Development Plan

## 1. 執行摘要 (Executive Summary)

### 1.1 產品定位 (Vision)
MEGA (Meta-Enterprise Global Assistant) 不僅是一個郵件客戶端，更是一個專為**保險經紀人 (Insurance Brokers)** 量身定制的 AI 操作系統。
**核心口號**：*Make Email Great Again* —— 將碎片化的郵件流轉化為可執行的結構化資產。

### 1.2 核心理念 (Philosophy)
*   **Mirror Indexing (鏡像索引)**：將每一封非結構化郵件解析為具備「意圖」(Intent) 與「實體」(Entity) 的對映鏡像，實現「數據即知識」。
*   **Contextual Intelligence**：所有的任務、文檔與對話都必須在同一個上下文中，消除切換成本。
*   **Skill Mining (技能挖掘)**：基於歷史數據，自動提取資深經紀人的溝通策略與專業知識，讓 AI 成為經紀人的數字孿生。

---

## 2. 產品需求文檔 (PRD)

### 2.1 目標用戶
*   大型保險經紀公司客戶經理。
*   需要處理海量承運商 (Carrier) 回單與客戶 (Client) 報價請求的運力方。

### 2.2 核心功能模組 (Feature Matrix)

#### A. 智能攝入管道 (AI Ingestion Pipeline) - **P0**
*   **意圖自動識別**：識別 Quote (報價)、Claim (理賠)、Renewal (續保)、Endorsement (批單) 等 10+ 種行業專有場景。
*   **結構化數據提取 (ACORD Mapping)**：自動從郵件正文/附件中提取 Premium, Deductible, Limit 等關鍵數據，存入 `MirrorIndex`。
*   **實體解析 (Identity Resolution)**：自動鎖定郵件關聯的客戶公司與保險公司。

#### B. 多維度鏡像視圖 (The Lens) - **P0**
*   **客戶/承運商視角 (Entity View)**：打破收件箱的概念，按客戶聚合所有歷史往來、文件與任務。
*   **情報視角 (Intelligence View)**：優先過濾出需要立即響應的「高價值意圖」（如待回覆的報價）。

#### C. 技能挖掘與回覆引擎 (Skills & Compose) - **P1**
*   **技能庫提取**：從歷史優秀回覆中提取 Prompts，例如「如何委婉解釋保費上漲」。
*   **一鍵生成**：基於提取的技能與當前郵件上下文，自動生成專業度極高的回覆初稿。

#### D. 任務引擎整合 (Contextual Tasks) - **P1**
*   **郵件轉任務**：長按郵件或右鍵一鍵生成看板任務，任務自動帶入原始郵件連結。

---

## 3. 技術架構規劃 (Technical Architecture)

### 3.1 前端 stack
*   **框架**: Next.js 14 (App Router)
*   **樣式**: Tailwind CSS (Apple Minimalist Design & Dark Mode)
*   **狀態管理**: Zustand + React Query
*   **組件庫**: Radix UI + Framer Motion (微交互)

### 3.2 後端 stack
*   **框架**: FastAPI (Python) - 高性能、原生支持異步。
*   **ORM**: SQLModel - 代碼即模型，支持快速叠代。
*   **向量數據庫**: pgvector - 用於 RAG (檢索增強生成) 與相似郵件檢索。
*   **AI 引擎**: LangChain / LlamaIndex + GPT-4o / Claude 3.5.

---

## 4. 研發里程碑與規劃 (Roadmap)

### 第一階段：夯實基礎 (Weeks 1-4) - **當前階段**
*   [x] 構建 3-Pane 專業 UI 框架。
*   [x] 實現基礎授權與數據庫建模 (MirrorIndex, Tags)。
*   [x] 實現初步的 AI 意圖識別 API。
*   [x] 實現全功能郵件處理流程 (Sent, Trash, Reply)。

### 第二階段：AI 深度賦能 (Weeks 5-8)
*   [ ] **PDF/OCR 模組**：集成智能報單掃描，提取 ACORD 表單數據。
*   [ ] **RAG 知識庫**：導入保險條款與公司政策，提供回覆建議的合規檢查。
*   [ ] **看板集成**：實現從郵件到看板任務的拖拽與雙向同步。

### 第三階段：生態與規模化 (Weeks 9-12+)
*   [ ] **多租戶隔離 (Multi-tenancy)**：支持大型組織的數據分區。
*   [ ] **移動端佈局**：優化 iPad/iPhone 端的使用體驗。
*   [ ] **API 開放平臺**：允許第三方保險服務商接入數據。

---

## 5. 商業價值與競爭優勢 (Business Value)
1.  **效率提升**：減少經紀人從郵件提取數據並手動輸入 ERP 的時間 (預計節省 60%+)。
2.  **知識沉淀**：將高級經紀人的經驗轉化為企業數字資產，不再隨人員流失而消失。
3.  **精準預測**：基於 Mirror Index 數據，可進行續保率與賠付率的 AI 預測分析。

---
*文件編號：MEGA-PRD-2026-V3*  
*狀態：設計方案進階中*
