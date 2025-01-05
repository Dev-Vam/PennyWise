class FinanceTracker{constructor(){this.transactions=JSON.parse(localStorage.getItem('transactions'))||[];this.goals=JSON.parse(localStorage.getItem('goals'))||[];this.balance=0;this.income=0;this.expenses=0;this.handleAddTransaction=this.handleAddTransaction.bind(this);this.handleAddGoal=this.handleAddGoal.bind(this);this.deleteTransaction=this.deleteTransaction.bind(this);this.deleteGoal=this.deleteGoal.bind(this);this.init()}
init(){const transactionForm=document.getElementById('transaction-form');const goalForm=document.getElementById('goal-form');if(transactionForm){transactionForm.addEventListener('submit',this.handleAddTransaction)}
if(goalForm){goalForm.addEventListener('submit',this.handleAddGoal)}
this.initMobileMenu();this.calculateTotals();this.displayTransactions();this.displayGoals();this.updateSummary()}
initMobileMenu(){const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav-menu');if(menuButton&&nav){menuButton.addEventListener('click',()=>{nav.classList.toggle('active');menuButton.classList.toggle('active')});document.addEventListener('click',(e)=>{if(!menuButton.contains(e.target)&&!nav.contains(e.target)){nav.classList.remove('active');menuButton.classList.remove('active')}})}}
handleAddTransaction(e){e.preventDefault();const amountInput=document.getElementById('amount');const categoryInput=document.getElementById('category');const descriptionInput=document.getElementById('description');const typeInput=document.getElementById('type');const amount=parseFloat(amountInput.value);const category=categoryInput.value;const description=descriptionInput.value;const type=typeInput.value;if(!amount||!category||!description||!type){this.showNotification('Please fill in all fields','error');return}
const transaction={id:Date.now(),amount,category,description,type,date:new Date().toISOString()};this.transactions.unshift(transaction);this.saveToLocalStorage();this.calculateTotals();this.displayTransactions();this.updateSummary();this.showNotification('Transaction added successfully!');e.target.reset()}
handleAddGoal(e){e.preventDefault();const name=document.getElementById('goal-name').value;const targetAmount=parseFloat(document.getElementById('goal-amount').value);const deadline=document.getElementById('goal-deadline').value;if(!name||!targetAmount||!deadline){this.showNotification('Please fill in all fields','error');return}
const goal={id:Date.now(),name,targetAmount,deadline,currentAmount:0};this.goals.push(goal);localStorage.setItem('goals',JSON.stringify(this.goals));this.displayGoals();this.showNotification('Goal added successfully!');e.target.reset()}
calculateTotals(){this.income=this.transactions.filter(t=>t.type==='income').reduce((sum,t)=>sum+t.amount,0);this.expenses=this.transactions.filter(t=>t.type==='expense').reduce((sum,t)=>sum+t.amount,0);this.balance=this.income-this.expenses;this.updateSummary()}
displayTransactions(){const transactionsList=document.getElementById('transaction-list');if(!transactionsList)return;transactionsList.innerHTML='';this.transactions.forEach(transaction=>{const element=document.createElement('div');element.className='transaction-item';const isIncome=transaction.type==='income';element.innerHTML=`
                <div class="transaction-info">
                    <span class="description">${transaction.description}</span>
                    <span class="category">${transaction.category}</span>
                </div>
                <div class="transaction-amount ${isIncome ? 'income' : 'expense'}">
                    ${isIncome ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                    <button onclick="financeTracker.deleteTransaction(${transaction.id})" class="delete-btn">×</button>
                </div>
            `;transactionsList.appendChild(element)})}
displayGoals(){const goalsList=document.getElementById('goals-list');if(!goalsList)return;goalsList.innerHTML='';this.goals.forEach(goal=>{const element=document.createElement('div');element.className='goal-item';element.innerHTML=`
                <div class="goal-info">
                    <h3>${goal.name}</h3>
                    <p>Target: ${this.formatCurrency(goal.targetAmount)}</p>
                    <p>Deadline: ${new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
                <button onclick="financeTracker.deleteGoal(${goal.id})" class="delete-btn">×</button>
            `;goalsList.appendChild(element)})}
updateSummary(){const balanceEl=document.getElementById('balance');const incomeEl=document.getElementById('income');const expensesEl=document.getElementById('expense');console.log('Current balance:',this.balance);console.log('Current income:',this.income);console.log('Current expenses:',this.expenses);if(balanceEl)balanceEl.textContent=this.formatCurrency(this.balance);if(incomeEl)incomeEl.textContent=this.formatCurrency(this.income);if(expensesEl)expensesEl.textContent=this.formatCurrency(this.expenses);}
deleteTransaction(id){this.transactions=this.transactions.filter(t=>t.id!==id);this.saveToLocalStorage();this.calculateTotals();this.displayTransactions()}
deleteGoal(id){this.goals=this.goals.filter(g=>g.id!==id);localStorage.setItem('goals',JSON.stringify(this.goals));this.displayGoals();this.showNotification('Goal deleted')}
saveToLocalStorage(){localStorage.setItem('transactions',JSON.stringify(this.transactions))}
formatCurrency(amount){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount)}
showNotification(message,type='success'){const notification=document.createElement('div');notification.className=`notification ${type}`;notification.textContent=message;document.body.appendChild(notification);setTimeout(()=>{notification.remove()},3000)}}
const financeTracker=new FinanceTracker()
