type TabsProps<T extends string> = {
  currentTab: T
  onChange: (tab: T) => void
}

export default function Tabs<T extends string>({ currentTab, onChange }: TabsProps<T>) {
  const tabs: T[] = ["Recommended Deals", "My Deals"] as T[]

  return (
    <div className="flex gap-4 mb-6 border-b">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`pb-2 px-3 text-sm font-medium border-b-2 ${currentTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'
            }`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
