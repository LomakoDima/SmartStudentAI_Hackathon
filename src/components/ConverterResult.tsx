import { Download, ArrowLeft, Move, ZoomIn, ZoomOut, RotateCcw, Copy, Trash2, Edit, Palette, Plus, Pin, PinOff, MousePointer2, X, CheckSquare, FileText, FileImage, File, ChevronDown, Printer, Share2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';

interface DraggableNode {
  id: string;
  x: number;
  y: number;
  content: string;
  color: string;
  connections?: string[];
  pinned?: boolean;
  rotation?: number; // Угол поворота для стикеров
  junctionX?: number; // X координата точки соединения
  junctionY?: number; // Y координата точки соединения
}

function ConverterResult() {
  const [format, setFormat] = useState<'summary' | 'mindmap' | 'cards' | 'notes'>('summary');
  const [nodes, setNodes] = useState<DraggableNode[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string | null } | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [nodesAppearing, setNodesAppearing] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [selectedNodesInitialPositions, setSelectedNodesInitialPositions] = useState<Map<string, { x: number; y: number; junctionX?: number; junctionY?: number }>>(new Map());
  // Начальная позиция для одиночного перетаскивания
  const [singleDragInitialPos, setSingleDragInitialPos] = useState<{ x: number; y: number; junctionX?: number; junctionY?: number } | null>(null);
  // Состояние развернутости для каждого узла (все уровни)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([
    'center', 
    // 2-й и 3-й уровни скрыты по умолчанию - раскрываются кликом на точку
  ]));
  // Состояние для перетаскивания точек соединения
  const [draggedJunction, setDraggedJunction] = useState<string | null>(null);
  const [junctionDragOffset, setJunctionDragOffset] = useState({ x: 0, y: 0 });
  const [junctionMoved, setJunctionMoved] = useState(false); // Было ли перемещение
  // Выделенные точки соединения
  const [selectedJunctions, setSelectedJunctions] = useState<Set<string>>(new Set());
  const [selectedJunctionsInitialPositions, setSelectedJunctionsInitialPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  // Начальная позиция мыши для определения порога движения
  const [junctionMouseStart, setJunctionMouseStart] = useState<{ x: number; y: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Состояние для меню скачивания
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Состояние для данных от ИИ
  const [aiData, setAiData] = useState<any>(null);

  useEffect(() => {
    const updateFormat = () => {
      // Получаем формат из URL hash параметров
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const formatParam = params.get('format') as 'summary' | 'mindmap' | 'cards' | 'notes';
      if (formatParam && ['summary', 'mindmap', 'cards', 'notes'].includes(formatParam)) {
        setFormat(formatParam);
      }
      
      // Загружаем данные от ИИ из localStorage
      const savedResult = localStorage.getItem('converterResult');
      if (savedResult) {
        try {
          const parsed = JSON.parse(savedResult);
          setAiData(parsed);
        } catch (e) {
          console.error('Ошибка парсинга данных ИИ:', e);
        }
      }
    };

    updateFormat();
    window.addEventListener('hashchange', updateFormat);
    
    return () => {
      window.removeEventListener('hashchange', updateFormat);
    };
  }, []);

  // Инициализация узлов для mind map и заметок
  useEffect(() => {
    if (format === 'mindmap') {
      // Четыре ряда с увеличенными пробелами
      const firstRowX = window.innerWidth * 0.08; // 8% - центральный узел
      const secondRowX = window.innerWidth * 0.26; // 26% - дочерние узлы (уровень 2)
      const thirdRowX = window.innerWidth * 0.48; // 48% - узлы уровня 3
      const fourthRowX = window.innerWidth * 0.72; // 72% - узлы уровня 4
      const centerY = window.innerHeight / 2;
      const junctionOffset = 100; // Отступ точки соединения
      
      // Цвета для веток
      const branchColors = [
        'from-blue-400 to-blue-600',
        'from-cyan-400 to-cyan-600',
        'from-green-400 to-green-600',
        'from-purple-400 to-purple-600',
        'from-pink-400 to-pink-600',
        'from-orange-400 to-orange-600'
      ];
      
      // Получаем данные от ИИ или используем fallback
      let centerContent = 'Тема';
      let childNodesData: { id: string; content: string; color: string; subtopics: { name: string; children: string[] }[] }[] = [];
      
      if (aiData?.branches) {
        // Используем данные от ИИ
        centerContent = aiData.center || 'Главная тема';
        childNodesData = aiData.branches.map((branch: any, index: number) => ({
          id: `node${index + 1}`,
          content: branch.title,
          color: branchColors[index % branchColors.length],
          subtopics: (branch.children || []).slice(0, 3).map((child: any) => ({
            name: child.title,
            children: (child.children || []).slice(0, 2).map((c: any) => c.title || c)
          }))
        }));
      } else {
        // Fallback данные если ИИ не вернул результат
        centerContent = 'Машинное обучение';
        childNodesData = [
          { 
            id: 'node1', 
            content: 'Обучение с учителем', 
            color: 'from-blue-400 to-blue-600',
            subtopics: [
              { name: 'Линейная регрессия', children: ['MSE', 'R²'] },
              { name: 'Деревья решений', children: ['Gini', 'Entropy'] },
              { name: 'Случайный лес', children: ['Bagging', 'Feature'] }
            ]
          },
          { 
            id: 'node2', 
            content: 'Обучение без учителя', 
            color: 'from-cyan-400 to-cyan-600',
            subtopics: [
              { name: 'K-means', children: ['Elbow', 'Silhouette'] },
              { name: 'DBSCAN', children: ['Eps', 'MinPts'] },
              { name: 'PCA', children: ['Variance', 'Components'] }
            ]
          },
          { 
            id: 'node3', 
            content: 'Применение', 
            color: 'from-green-400 to-green-600',
            subtopics: [
              { name: 'CV', children: ['CNN', 'YOLO'] },
              { name: 'NLP', children: ['BERT', 'GPT'] },
              { name: 'RecSys', children: ['CF', 'Content'] }
            ]
          },
          { 
            id: 'node4', 
            content: 'Алгоритмы', 
            color: 'from-purple-400 to-purple-600',
            subtopics: [
              { name: 'Градиентный спуск', children: ['SGD', 'Adam'] },
              { name: 'Backprop', children: ['Chain', 'Auto'] },
              { name: 'Оптимизация', children: ['L1', 'L2'] }
            ]
          },
        ];
      }
      
      // Расстояния
      const thirdLevelSpacing = 80; // Расстояние ВНУТРИ группы (маленькое)
      const fourthLevelSpacing = 70; // Расстояние между узлами 4-го уровня
      
      // Генерируем узлы уровня 3 и 4
      const thirdLevelNodes: DraggableNode[] = [];
      const fourthLevelNodes: DraggableNode[] = [];
      
      // Максимально компактные расстояния
      const fourthLevelInnerSpacing = 45; // Внутри подгруппы 4-го уровня
      const fourthLevelSubgroupSpacing = 50; // Между подгруппами (3-й ряд) - минимум
      const groupSpacing = 0; // Без пробелов между цветовыми группами
      
      // Считаем общую высоту
      const numGroups = childNodesData.length;
      const nodesPerGroup = 3; // узлов в каждой группе
      const nodesPerSubgroup = 2; // узлов 4-го уровня в подгруппе
      const subgroupHeight = (nodesPerSubgroup - 1) * fourthLevelInnerSpacing;
      const colorGroupHeight = nodesPerGroup * subgroupHeight + (nodesPerGroup - 1) * fourthLevelSubgroupSpacing;
      const totalHeight = numGroups * colorGroupHeight + (numGroups - 1) * groupSpacing;
      
      let currentY = centerY - totalHeight / 2;
      
      // Позиции родителей (уровень 2) будут вычислены на основе их детей
      const parentPositions: { [key: string]: number } = {};
      
      childNodesData.forEach((childNode, groupIndex) => {
        const groupStartY = currentY;
        const childYPositions: number[] = [];
        
        // Считаем позиции для узлов 4-го уровня в этой цветовой группе
        let fourthY = currentY;
        
        childNode.subtopics.forEach((subtopic, i) => {
          const thirdLevelId = `${childNode.id}_${i}`;
          
          // Узлы четвёртого уровня для этого узла третьего уровня
          const fourthLevelIds: string[] = [];
          const fourthSubgroupStartY = fourthY;
          
          subtopic.children.forEach((child, j) => {
            const fourthLevelId = `${thirdLevelId}_${j}`;
            fourthLevelIds.push(fourthLevelId);
            
            fourthLevelNodes.push({
              id: fourthLevelId,
              x: fourthRowX,
              y: fourthY,
              content: child,
              color: childNode.color,
              connections: [thirdLevelId],
              pinned: false,
            });
            
            fourthY += fourthLevelInnerSpacing;
          });
          
          // Вычисляем Y для узла 3-го уровня как центр его детей 4-го уровня
          const fourthSubgroupEndY = fourthY - fourthLevelInnerSpacing;
          const thirdLevelY = (fourthSubgroupStartY + fourthSubgroupEndY) / 2;
          
          thirdLevelNodes.push({
            id: thirdLevelId,
            x: thirdRowX,
            y: thirdLevelY,
            content: subtopic.name,
            color: childNode.color,
            connections: [childNode.id, ...fourthLevelIds],
            pinned: false,
            junctionX: thirdRowX + junctionOffset,
            junctionY: thirdLevelY,
          });
          
          childYPositions.push(thirdLevelY);
          
          // Добавляем пробел между подгруппами 4-го уровня (но не после последней)
          if (i < childNode.subtopics.length - 1) {
            fourthY += fourthLevelSubgroupSpacing - fourthLevelInnerSpacing;
          }
        });
        
        // Вычисляем позицию родителя как среднее позиций детей
        parentPositions[childNode.id] = (childYPositions[0] + childYPositions[childYPositions.length - 1]) / 2;
        
        // Добавляем большой пробел МЕЖДУ цветовыми группами (но не после последней)
        if (groupIndex < childNodesData.length - 1) {
          fourthY += groupSpacing;
        }
        
        currentY = fourthY; // Синхронизируем
      });
      
      // Создаем дочерние узлы с junctionX/junctionY
      const childNodesWithJunction = childNodesData.map(childNode => {
        const childThirdLevelIds = thirdLevelNodes
          .filter(n => n.connections?.includes(childNode.id))
          .map(n => n.id);
        
        const parentY = parentPositions[childNode.id];
        
        return {
          id: childNode.id,
          x: secondRowX,
          y: parentY,
          content: childNode.content,
          color: childNode.color,
          connections: ['center', ...childThirdLevelIds],
          pinned: false,
          junctionX: secondRowX + junctionOffset,
          junctionY: parentY,
        };
      });
      
      const centerConnections = childNodesData.map(n => n.id);
      
      const newNodes: DraggableNode[] = [
        { id: 'center', x: firstRowX, y: centerY, content: centerContent, color: 'from-blue-500 to-cyan-500', connections: centerConnections, pinned: false, junctionX: firstRowX + junctionOffset, junctionY: centerY },
        ...childNodesWithJunction,
        ...thirdLevelNodes,
        ...fourthLevelNodes,
      ];
      
      setNodes(newNodes);
      setNodesAppearing(new Set(newNodes.map(n => n.id)));
      setTimeout(() => setNodesAppearing(new Set()), 300);
      
      // Вычисляем оптимальный масштаб чтобы всё поместилось
      const allYs = newNodes.map(n => n.y);
      const allXs = newNodes.map(n => n.x);
      const minY = Math.min(...allYs);
      const maxY = Math.max(...allYs);
      const minX = Math.min(...allXs);
      const maxX = Math.max(...allXs);
      
      const contentWidth = maxX - minX + 200; // +200 для отступов и размера узлов
      const contentHeight = maxY - minY + 150;
      
      const screenWidth = window.innerWidth - 80;
      const screenHeight = window.innerHeight - 80;
      
      const scaleX = screenWidth / contentWidth;
      const scaleY = screenHeight / contentHeight;
      const optimalZoom = Math.min(scaleX, scaleY, 1); // Не больше 1
      
      setZoom(Math.max(optimalZoom, 0.2)); // Минимум 0.2 для лучшей видимости
      
      // Центрируем контент
      const contentCenterX = (minX + maxX) / 2;
      const contentCenterY = (minY + maxY) / 2;
      const finalZoom = Math.max(optimalZoom, 0.2);
      setPan({
        x: window.innerWidth / 2 - contentCenterX * finalZoom,
        y: window.innerHeight / 2 - contentCenterY * finalZoom
      });
    } else if (format === 'notes') {
      // Располагаем заметки в сетке
      const cols = 4; // Количество колонок
      const noteWidth = 260;
      const noteHeight = 180;
      const gapX = 40;
      const gapY = 40;
      const startX = 200;
      const startY = 150;
      
      // Цвета для заметок
      const noteColors: Record<string, string> = {
        blue: 'from-blue-500 to-blue-600',
        cyan: 'from-cyan-500 to-cyan-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        pink: 'from-pink-500 to-pink-600',
        orange: 'from-orange-500 to-orange-600'
      };
      
      const defaultColors = ['from-blue-500 to-blue-600', 'from-cyan-500 to-cyan-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-orange-500 to-orange-600'];
      
      let newNodes: DraggableNode[] = [];
      
      if (aiData?.notes && Array.isArray(aiData.notes)) {
        // Используем данные от ИИ
        newNodes = aiData.notes.map((note: any, index: number) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          return {
            id: `note${index + 1}`,
            x: startX + col * (noteWidth + gapX),
            y: startY + row * (noteHeight + gapY),
            content: `${note.title}\n${note.content}`,
            color: noteColors[note.color] || defaultColors[index % defaultColors.length],
            pinned: false,
            rotation: 0
          };
        });
      } else {
        // Fallback данные
        newNodes = [
          { 
            id: 'note1', 
            x: startX,
            y: startY, 
            content: 'Основная тема\nКлючевые концепции и идеи', 
            color: 'from-blue-500 to-blue-600',
            pinned: false,
            rotation: 0
          },
          { 
            id: 'note2', 
            x: startX + noteWidth + gapX,
            y: startY, 
            content: 'Важные детали\nДополнительная информация', 
            color: 'from-cyan-500 to-cyan-600',
            pinned: false,
            rotation: 0
          },
          { 
            id: 'note3', 
            x: startX + 2 * (noteWidth + gapX),
            y: startY, 
            content: 'Заметка\nИнтересный факт или идея', 
            color: 'from-green-500 to-green-600',
            pinned: false,
            rotation: 0
          },
          { 
            id: 'note4', 
            x: startX + 3 * (noteWidth + gapX),
            y: startY, 
            content: 'Применение\nПрактическое использование', 
            color: 'from-purple-500 to-purple-600',
            pinned: false,
            rotation: 0
          },
        ];
      }
      
      setNodes(newNodes);
      setNodesAppearing(new Set(newNodes.map(n => n.id)));
      setTimeout(() => setNodesAppearing(new Set()), 300);
    } else {
      setNodes([]);
      setNodesAppearing(new Set());
    }
  }, [format, aiData]);

  // Очищаем выделение скрытых узлов при изменении expandedNodes
  useEffect(() => {
    const isCenterExpanded = expandedNodes.has('center');
    
    setSelectedNodes(prev => {
      const newSelected = new Set<string>();
      prev.forEach(nodeId => {
        let isVisible = true;
        const underscoreCount = (nodeId.match(/_/g) || []).length;
        
        if (nodeId !== 'center' && underscoreCount === 0) {
          isVisible = isCenterExpanded;
        } else if (underscoreCount === 1) {
          const parentId = nodeId.split('_')[0];
          isVisible = isCenterExpanded && expandedNodes.has(parentId);
        } else if (underscoreCount === 2) {
          const parts = nodeId.split('_');
          const level2ParentId = parts[0];
          const level3ParentId = `${parts[0]}_${parts[1]}`;
          isVisible = isCenterExpanded && expandedNodes.has(level2ParentId) && expandedNodes.has(level3ParentId);
        }
        
        if (isVisible) {
          newSelected.add(nodeId);
        }
      });
      return newSelected;
    });
  }, [expandedNodes]);

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return; // Только левая кнопка мыши
    e.stopPropagation(); // Предотвращаем панорамирование при клике на узел
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Если зажат Shift или Ctrl/Cmd, добавляем/убираем из выделения
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      setSelectedNodes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return newSet;
      });
      return;
    }

    // Если элемент не выделен, но есть другие выделенные - очищаем выделение и выделяем только этот
    if (!selectedNodes.has(nodeId) && selectedNodes.size > 0) {
      setSelectedNodes(new Set([nodeId]));
    }

    // Если элемент выделен и есть другие выделенные элементы, начинаем перетаскивание всех
    if (selectedNodes.has(nodeId) && selectedNodes.size > 1) {
      // Сохраняем начальные позиции всех выделенных элементов (включая позиции точек)
      const initialPositions = new Map<string, { x: number; y: number; junctionX?: number; junctionY?: number }>();
      selectedNodes.forEach(selectedId => {
        const selectedNode = nodes.find(n => n.id === selectedId);
        if (selectedNode && !selectedNode.pinned) {
          initialPositions.set(selectedId, { 
            x: selectedNode.x, 
            y: selectedNode.y,
            junctionX: selectedNode.junctionX,
            junctionY: selectedNode.junctionY
          });
        }
      });
      setSelectedNodesInitialPositions(initialPositions);
      
      // Используем этот элемент как опорную точку
      setDraggedNode(nodeId);
      setDragOffset({
        x: e.clientX - (node.x * zoom + pan.x),
        y: e.clientY - (node.y * zoom + pan.y)
      });
    } else {
      // Обычное перетаскивание одного элемента
      // Закрепленные элементы нельзя перемещать
      if (node.pinned) return;

      setDraggedNode(nodeId);
      setDragOffset({
        x: e.clientX - (node.x * zoom + pan.x),
        y: e.clientY - (node.y * zoom + pan.y)
      });
      // Сохраняем начальную позицию для корректного перемещения точки
      setSingleDragInitialPos({
        x: node.x,
        y: node.y,
        junctionX: node.junctionX,
        junctionY: node.junctionY
      });
    }

    setIsPanning(false); // Отключаем панорамирование при перетаскивании узла
    setIsSelecting(false); // Отключаем выделение при перетаскивании узла
  };

  useEffect(() => {
    let lastUpdateTime = 0;
    const throttleMs = 8; // ~120fps для плавности
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastUpdateTime < throttleMs) return;
      lastUpdateTime = now;
      
      // Используем requestAnimationFrame для плавности
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        if (draggedNode) {
          const newX = (e.clientX - dragOffset.x - pan.x) / zoom;
          const newY = (e.clientY - dragOffset.y - pan.y) / zoom;
          
          // Если перетаскивается несколько выделенных элементов
          if (selectedNodes.size > 1 && selectedNodes.has(draggedNode) && selectedNodesInitialPositions.size > 0) {
            const draggedNodeInitial = selectedNodesInitialPositions.get(draggedNode);
            if (draggedNodeInitial) {
              // Вычисляем смещение от начальной позиции опорного элемента
              const deltaX = newX - draggedNodeInitial.x;
              const deltaY = newY - draggedNodeInitial.y;
              
              // Применяем то же смещение ко всем выделенным элементам (и их точкам соединения)
              setNodes(prev => prev.map(node => {
                if (selectedNodes.has(node.id) && !node.pinned) {
                  const initialPos = selectedNodesInitialPositions.get(node.id);
                  if (initialPos) {
                    const updatedX = initialPos.x + deltaX;
                    const updatedY = initialPos.y + deltaY;
                    return {
                      ...node,
                      x: updatedX,
                      y: updatedY,
                      // Также двигаем точку соединения (используем сохранённые начальные позиции)
                      junctionX: initialPos.junctionX !== undefined ? initialPos.junctionX + deltaX : undefined,
                      junctionY: initialPos.junctionY !== undefined ? initialPos.junctionY + deltaY : undefined
                    };
                  }
                }
                return node;
              }));
            }
          } else if (singleDragInitialPos) {
            // Обычное перетаскивание одного элемента
            const deltaX = newX - singleDragInitialPos.x;
            const deltaY = newY - singleDragInitialPos.y;
            
            setNodes(prev => prev.map(node => 
              node.id === draggedNode 
                ? { 
                    ...node, 
                    x: newX, 
                    y: newY,
                    // Также двигаем точку соединения (используем начальную позицию)
                    junctionX: singleDragInitialPos.junctionX !== undefined ? singleDragInitialPos.junctionX + deltaX : undefined,
                    junctionY: singleDragInitialPos.junctionY !== undefined ? singleDragInitialPos.junctionY + deltaY : undefined
                  }
                : node
            ));
          }
        } else if (draggedJunction) {
          // Перетаскивание точки соединения
          const rect = boardRef.current?.getBoundingClientRect();
          if (rect) {
            const newJunctionX = (e.clientX - rect.left - junctionDragOffset.x - pan.x) / zoom;
            const newJunctionY = (e.clientY - rect.top - junctionDragOffset.y - pan.y) / zoom;
            
            // Проверяем порог движения (5 пикселей) перед установкой флага перемещения
            if (junctionMouseStart) {
              const dx = e.clientX - junctionMouseStart.x;
              const dy = e.clientY - junctionMouseStart.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance > 5) {
                setJunctionMoved(true); // Отмечаем что было реальное перемещение
              }
            }
            
            // Если перетаскивается несколько выделенных точек
            if (selectedJunctions.size > 1 && selectedJunctions.has(draggedJunction) && selectedJunctionsInitialPositions.size > 0) {
              const draggedInitial = selectedJunctionsInitialPositions.get(draggedJunction);
              if (draggedInitial) {
                const deltaX = newJunctionX - draggedInitial.x;
                const deltaY = newJunctionY - draggedInitial.y;
                
                setNodes(prev => prev.map(node => {
                  if (selectedJunctions.has(node.id) && node.junctionX !== undefined && node.junctionY !== undefined) {
                    const initialPos = selectedJunctionsInitialPositions.get(node.id);
                    if (initialPos) {
                      return {
                        ...node,
                        junctionX: initialPos.x + deltaX,
                        junctionY: initialPos.y + deltaY
                      };
                    }
                  }
                  return node;
                }));
              }
            } else {
              // Обычное перетаскивание одной точки
              setNodes(prev => prev.map(node => 
                node.id === draggedJunction
                  ? { ...node, junctionX: newJunctionX, junctionY: newJunctionY }
                  : node
              ));
            }
          }
        } else if (isPanning) {
          setPan({
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y
          });
        } else if (isSelecting && selectionStart) {
          const rect = boardRef.current?.getBoundingClientRect();
          if (rect) {
            setSelectionEnd({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          }
        }
      }); // закрываем requestAnimationFrame
    };

    const handleGlobalMouseUp = () => {
      if (isSelecting && selectionStart && selectionEnd) {
        // Вычисляем прямоугольник выделения
        const minX = Math.min(selectionStart.x, selectionEnd.x);
        const maxX = Math.max(selectionStart.x, selectionEnd.x);
        const minY = Math.min(selectionStart.y, selectionEnd.y);
        const maxY = Math.max(selectionStart.y, selectionEnd.y);

        // Находим все узлы, которые попали в прямоугольник
        const selected = new Set<string>();
        const currentFormat = format;
        const isCenterExpanded = expandedNodes.has('center');
        
        nodes.forEach(node => {
          // Проверяем видимость узла перед добавлением в выделение
          let isVisible = true;
          const underscoreCount = (node.id.match(/_/g) || []).length;
          
          if (node.id !== 'center' && underscoreCount === 0) {
            // Уровень 2 - виден если center развёрнут
            isVisible = isCenterExpanded;
          } else if (underscoreCount === 1) {
            // Уровень 3 - виден если center и родитель развёрнуты
            const parentId = node.id.split('_')[0];
            isVisible = isCenterExpanded && expandedNodes.has(parentId);
          } else if (underscoreCount === 2) {
            // Уровень 4 - виден если вся цепочка развёрнута
            const parts = node.id.split('_');
            const level2ParentId = parts[0];
            const level3ParentId = `${parts[0]}_${parts[1]}`;
            isVisible = isCenterExpanded && expandedNodes.has(level2ParentId) && expandedNodes.has(level3ParentId);
          }
          
          // Пропускаем скрытые узлы
          if (!isVisible) return;
          
          const nodeScreenX = node.x * zoom + pan.x;
          const nodeScreenY = node.y * zoom + pan.y;
          
          // Приблизительные размеры элемента (с учетом transform: translate(-50%, -50%))
          const nodeWidth = currentFormat === 'notes' ? 250 : 150;
          const nodeHeight = currentFormat === 'notes' ? 150 : 100;
          
          const nodeLeft = nodeScreenX - nodeWidth / 2;
          const nodeRight = nodeScreenX + nodeWidth / 2;
          const nodeTop = nodeScreenY - nodeHeight / 2;
          const nodeBottom = nodeScreenY + nodeHeight / 2;
          
          // Проверяем пересечение прямоугольников
          if (!(nodeRight < minX || nodeLeft > maxX || nodeBottom < minY || nodeTop > maxY)) {
            selected.add(node.id);
          }
        });

        setSelectedNodes(selected);
        
        // Также выделяем точки соединения, которые попали в прямоугольник
        const selectedJuncs = new Set<string>();
        nodes.forEach(node => {
          if (node.junctionX === undefined || node.junctionY === undefined) return;
          
          // Проверяем видимость точки (как и узла)
          let isVisible = true;
          const underscoreCount = (node.id.match(/_/g) || []).length;
          
          if (node.id !== 'center' && underscoreCount === 0) {
            isVisible = isCenterExpanded;
          } else if (underscoreCount === 1) {
            const parentId = node.id.split('_')[0];
            isVisible = isCenterExpanded && expandedNodes.has(parentId);
          } else if (underscoreCount === 2) {
            const parts = node.id.split('_');
            isVisible = isCenterExpanded && expandedNodes.has(parts[0]) && expandedNodes.has(`${parts[0]}_${parts[1]}`);
          }
          
          if (!isVisible) return;
          
          // Проверяем есть ли дочерние узлы (только они имеют точки)
          const childConnections = node.connections?.filter(id => {
            if (id === 'center') return false;
            if (underscoreCount === 1 && id === node.id.split('_')[0]) return false;
            if (underscoreCount === 2) {
              const parts = node.id.split('_');
              if (id === `${parts[0]}_${parts[1]}`) return false;
            }
            return true;
          }) || [];
          
          if (childConnections.length === 0) return;
          
          const junctionScreenX = node.junctionX * zoom + pan.x;
          const junctionScreenY = node.junctionY * zoom + pan.y;
          
          // Размер точки ~20px
          const juncSize = 20;
          const juncLeft = junctionScreenX - juncSize / 2;
          const juncRight = junctionScreenX + juncSize / 2;
          const juncTop = junctionScreenY - juncSize / 2;
          const juncBottom = junctionScreenY + juncSize / 2;
          
          if (!(juncRight < minX || juncLeft > maxX || juncBottom < minY || juncTop > maxY)) {
            selectedJuncs.add(node.id);
          }
        });
        
        setSelectedJunctions(selectedJuncs);
      }

      setDraggedNode(null);
      setDraggedJunction(null);
      setJunctionMoved(false);
      setJunctionMouseStart(null);
      setSingleDragInitialPos(null);
      setIsPanning(false);
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      setSelectedNodesInitialPositions(new Map()); // Очищаем сохраненные позиции
      setSelectedJunctionsInitialPositions(new Map());
    };

    if (draggedNode || draggedJunction || isPanning || isSelecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      // Отменяем кадр анимации при размонтировании
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draggedNode, draggedJunction, isPanning, isSelecting, dragOffset, junctionDragOffset, pan, zoom, panStart, selectionStart, selectionEnd, nodes, format, selectedNodes, selectedNodesInitialPositions, selectedJunctions, selectedJunctionsInitialPositions, expandedNodes, singleDragInitialPos, junctionMouseStart]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode || draggedJunction || isPanning || isSelecting) {
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setDraggedJunction(null);
    setJunctionMoved(false);
    setJunctionMouseStart(null);
    setSingleDragInitialPos(null);
    setIsPanning(false);
  };

  const handleBoardMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Правая кнопка мыши - панорамирование
    if (e.button === 2) {
      e.preventDefault();
      if (target === boardRef.current || target.classList.contains('board-area') || target.closest('.board-area')) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX - pan.x,
          y: e.clientY - pan.y
        });
        setIsSelecting(false);
      }
      return;
    }
    
    // Левая кнопка мыши - выделение
    if (e.button !== 0) return;
    
    // Если клик на узле, не начинаем выделение
    if (target.closest('[data-node-id]')) {
      return;
    }

    // Проверяем, что клик на пустой области доски
    if (target === boardRef.current || target.classList.contains('board-area') || target.closest('.board-area')) {
      // Начинаем выделение при клике на пустой области
      setIsSelecting(true);
      const rect = boardRef.current?.getBoundingClientRect();
      if (rect) {
        setSelectionStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setSelectionEnd({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      // Очищаем предыдущее выделение, если не зажат Shift/Ctrl
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        setSelectedNodes(new Set());
        setSelectedJunctions(new Set());
      }
    }
  };

  // Обработчик колеса мыши для зума
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom + delta));
    
    // Масштабирование относительно позиции курсора
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Вычисляем новую позицию панорамирования для центрирования на курсоре
      const zoomFactor = newZoom / zoom;
      setPan({
        x: mouseX - (mouseX - pan.x) * zoomFactor,
        y: mouseY - (mouseY - pan.y) * zoomFactor
      });
    }
    
    setZoom(newZoom);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    // Развернуть все узлы
    setExpandedNodes(new Set([
      'center', 
      'node1', 'node2', 'node3', 'node4',
      'node1_0', 'node1_1', 'node1_2',
      'node2_0', 'node2_1', 'node2_2',
      'node3_0', 'node3_1', 'node3_2',
      'node4_0', 'node4_1', 'node4_2',
    ]));
    
    // Если это mind map, пересчитываем позиции узлов
    if (format === 'mindmap' && nodes.length > 0) {
      const firstRowX = window.innerWidth * 0.08;
      const secondRowX = window.innerWidth * 0.26;
      const thirdRowX = window.innerWidth * 0.48;
      const fourthRowX = window.innerWidth * 0.72;
      const centerY = window.innerHeight / 2;
      const junctionOffset = 100;
      // Максимально компактные расстояния
      const fourthLevelInnerSpacing = 45; // Внутри подгруппы 4-го уровня
      const fourthLevelSubgroupSpacing = 50; // Между подгруппами 4-го уровня
      const groupSpacing = 0; // Без пробелов между цветовыми группами
      
      // Группы родителей
      const parentIds = ['node1', 'node2', 'node3', 'node4'];
      const nodesPerGroup = 3; // подгрупп в каждой цветовой группе
      const nodesPerSubgroup = 2; // узлов 4-го уровня в подгруппе
      
      // Вычисляем позиции
      const fourthLevelPositions: { [key: string]: number } = {};
      const thirdLevelPositions: { [key: string]: number } = {};
      const parentPositions: { [key: string]: number } = {};
      
      // Считаем общую высоту
      const subgroupHeight = (nodesPerSubgroup - 1) * fourthLevelInnerSpacing;
      const colorGroupHeight = nodesPerGroup * subgroupHeight + (nodesPerGroup - 1) * fourthLevelSubgroupSpacing;
      const totalHeight = parentIds.length * colorGroupHeight + (parentIds.length - 1) * groupSpacing;
      
      let currentY = centerY - totalHeight / 2;
      
      parentIds.forEach((parentId, groupIndex) => {
        const colorGroupStartY = currentY;
        const thirdLevelYs: number[] = [];
        
        for (let i = 0; i < nodesPerGroup; i++) {
          const thirdLevelId = `${parentId}_${i}`;
          const subgroupStartY = currentY;
          
          // Узлы 4-го уровня
          for (let j = 0; j < nodesPerSubgroup; j++) {
            const fourthLevelId = `${thirdLevelId}_${j}`;
            fourthLevelPositions[fourthLevelId] = currentY;
            currentY += fourthLevelInnerSpacing;
          }
          
          // Позиция 3-го уровня - центр подгруппы
          const subgroupEndY = currentY - fourthLevelInnerSpacing;
          thirdLevelPositions[thirdLevelId] = (subgroupStartY + subgroupEndY) / 2;
          thirdLevelYs.push(thirdLevelPositions[thirdLevelId]);
          
          // Пробел между подгруппами
          if (i < nodesPerGroup - 1) {
            currentY += fourthLevelSubgroupSpacing - fourthLevelInnerSpacing;
          }
        }
        
        // Позиция родителя - центр всех детей
        parentPositions[parentId] = (thirdLevelYs[0] + thirdLevelYs[thirdLevelYs.length - 1]) / 2;
        
        // Большой пробел между цветовыми группами
        if (groupIndex < parentIds.length - 1) {
          currentY += groupSpacing;
        }
      });
      
      setNodes(prev => prev.map(node => {
        const underscoreCount = (node.id.match(/_/g) || []).length;
        
        if (node.id === 'center') {
          return { ...node, x: firstRowX, y: centerY, junctionX: firstRowX + junctionOffset, junctionY: centerY };
        } else if (node.id.startsWith('node') && underscoreCount === 0) {
          const nodeY = parentPositions[node.id] || centerY;
          return { ...node, x: secondRowX, y: nodeY, junctionX: secondRowX + junctionOffset, junctionY: nodeY };
        } else if (underscoreCount === 1) {
          const nodeY = thirdLevelPositions[node.id];
          return { ...node, x: thirdRowX, y: nodeY, junctionX: thirdRowX + junctionOffset, junctionY: nodeY };
        } else if (underscoreCount === 2) {
          const nodeY = fourthLevelPositions[node.id];
          return { ...node, x: fourthRowX, y: nodeY };
        }
        return node;
      }));
    }
  };

  const handleBack = () => {
    window.location.hash = '#converter';
  };

  // Функции для скачивания
  const downloadAsText = () => {
    let content = '';
    
    if (format === 'summary' && aiData) {
      content = `${aiData.title || 'Конспект'}\n\n`;
      if (aiData.sections) {
        aiData.sections.forEach((section: any, idx: number) => {
          content += `${idx + 1}. ${section.heading}\n`;
          content += `${section.content}\n`;
          if (section.keyPoints) {
            section.keyPoints.forEach((point: string) => {
              content += `  • ${point}\n`;
            });
          }
          content += '\n';
        });
      }
      if (aiData.conclusion) {
        content += `Заключение:\n${aiData.conclusion}`;
      }
    } else if (format === 'cards' && aiData?.cards) {
      content = 'Карточки для запоминания\n\n';
      aiData.cards.forEach((card: any, idx: number) => {
        content += `Карточка ${idx + 1}\n`;
        content += `Вопрос: ${card.question}\n`;
        content += `Ответ: ${card.answer}\n\n`;
      });
    } else if (format === 'notes' || format === 'mindmap') {
      content = nodes.map(node => node.content).join('\n\n');
    }
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${format}_result.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadAsJSON = () => {
    const data = {
      format,
      data: aiData,
      nodes: format === 'mindmap' || format === 'notes' ? nodes : undefined
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${format}_result.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadAsMarkdown = () => {
    let content = '';
    
    if (format === 'summary' && aiData) {
      content = `# ${aiData.title || 'Конспект'}\n\n`;
      if (aiData.sections) {
        aiData.sections.forEach((section: any, idx: number) => {
          content += `## ${idx + 1}. ${section.heading}\n\n`;
          content += `${section.content}\n\n`;
          if (section.keyPoints) {
            content += `**Ключевые моменты:**\n`;
            section.keyPoints.forEach((point: string) => {
              content += `- ${point}\n`;
            });
            content += '\n';
          }
        });
      }
      if (aiData.conclusion) {
        content += `## Заключение\n\n${aiData.conclusion}`;
      }
    } else if (format === 'cards' && aiData?.cards) {
      content = '# Карточки для запоминания\n\n';
      aiData.cards.forEach((card: any, idx: number) => {
        content += `### Карточка ${idx + 1}\n\n`;
        content += `**Вопрос:** ${card.question}\n\n`;
        content += `**Ответ:** ${card.answer}\n\n---\n\n`;
      });
    } else if (format === 'mindmap') {
      content = '# Mind Map\n\n';
      const centerNode = nodes.find(n => n.id === 'center');
      if (centerNode) {
        content += `## ${centerNode.content}\n\n`;
      }
      nodes.filter(n => n.id !== 'center' && !n.id.includes('_')).forEach(node => {
        content += `### ${node.content}\n\n`;
      });
    } else if (format === 'notes') {
      content = '# Заметки\n\n';
      nodes.forEach((node, idx) => {
        content += `## Заметка ${idx + 1}\n\n${node.content}\n\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${format}_result.md`;
    link.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const downloadAsHTML = () => {
    let htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${format === 'summary' ? 'Конспект' : format === 'cards' ? 'Карточки' : format === 'mindmap' ? 'Mind Map' : 'Заметки'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #1e3a8a; }
    h2 { color: #3b82f6; }
    .card { background: white; border-radius: 12px; padding: 20px; margin: 15px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .question { font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .answer { color: #4b5563; }
    .note { background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 20px; border-radius: 8px; margin: 10px 0; }
    ul { padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>`;

    if (format === 'summary' && aiData) {
      htmlContent += `<h1>${aiData.title || 'Конспект'}</h1>`;
      if (aiData.sections) {
        aiData.sections.forEach((section: any, idx: number) => {
          htmlContent += `<div class="card"><h2>${idx + 1}. ${section.heading}</h2><p>${section.content}</p>`;
          if (section.keyPoints) {
            htmlContent += '<ul>';
            section.keyPoints.forEach((point: string) => {
              htmlContent += `<li>${point}</li>`;
            });
            htmlContent += '</ul>';
          }
          htmlContent += '</div>';
        });
      }
      if (aiData.conclusion) {
        htmlContent += `<div class="card"><h2>Заключение</h2><p>${aiData.conclusion}</p></div>`;
      }
    } else if (format === 'cards' && aiData?.cards) {
      htmlContent += '<h1>Карточки для запоминания</h1>';
      aiData.cards.forEach((card: any, idx: number) => {
        htmlContent += `<div class="card"><p class="question">Вопрос ${idx + 1}: ${card.question}</p><p class="answer">Ответ: ${card.answer}</p></div>`;
      });
    } else if (format === 'notes') {
      htmlContent += '<h1>Заметки</h1>';
      nodes.forEach((node, idx) => {
        htmlContent += `<div class="note"><strong>Заметка ${idx + 1}</strong><br>${node.content.replace(/\n/g, '<br>')}</div>`;
      });
    }

    htmlContent += '</body></html>';
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${format}_result.html`;
    link.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const copyToClipboard = () => {
    let content = '';
    
    if (format === 'summary' && aiData) {
      content = `${aiData.title || 'Конспект'}\n\n`;
      if (aiData.sections) {
        aiData.sections.forEach((section: any, idx: number) => {
          content += `${idx + 1}. ${section.heading}\n${section.content}\n`;
          if (section.keyPoints) {
            section.keyPoints.forEach((point: string) => {
              content += `• ${point}\n`;
            });
          }
          content += '\n';
        });
      }
    } else if (format === 'cards' && aiData?.cards) {
      aiData.cards.forEach((card: any, idx: number) => {
        content += `Вопрос ${idx + 1}: ${card.question}\nОтвет: ${card.answer}\n\n`;
      });
    } else {
      content = nodes.map(node => node.content).join('\n\n');
    }
    
    navigator.clipboard.writeText(content);
    setShowDownloadMenu(false);
    alert('Скопировано в буфер обмена!');
  };

  const handlePrint = () => {
    window.print();
    setShowDownloadMenu(false);
  };

  // Закрытие меню скачивания при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    
    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadMenu]);

  // Обработчик правого клика
  const handleContextMenu = (e: React.MouseEvent, nodeId: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Устанавливаем меню напрямую
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId
    });
  };

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    // Используем mousedown вместо click для более быстрой реакции
    // Добавляем обработчик с небольшой задержкой, чтобы не закрыть меню сразу после открытия
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  // Действия контекстного меню
  const handleDuplicateNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newId = `${nodeId}_copy_${Date.now()}`;
    const newNode: DraggableNode = {
      ...node,
      id: newId,
      x: node.x + 50,
      y: node.y + 50
    };

    setNodes([...nodes, newNode]);
    setContextMenu(null);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setContextMenu(null);
  };

  const handleEditNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setEditingNode(nodeId);
    setEditContent(node.content);
    setContextMenu(null);
  };

  const handleSaveEdit = () => {
    if (!editingNode) return;

    setNodes(nodes.map(node => 
      node.id === editingNode 
        ? { ...node, content: editContent }
        : node
    ));
    setEditingNode(null);
    setEditContent('');
  };

  const handleChangeColor = (nodeId: string, color: string) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, color }
        : node
    ));
    setContextMenu(null);
  };

  const handleAddNode = (x: number, y: number) => {
    const newId = `node_${Date.now()}`;
    const colors = [
      'from-blue-500 to-blue-600',
      'from-cyan-500 to-cyan-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNode: DraggableNode = {
      id: newId,
      x: (x - pan.x) / zoom,
      y: (y - pan.y) / zoom,
      content: 'Новая заметка',
      color: randomColor,
      pinned: false,
      rotation: (Math.random() - 0.5) * 8 // Случайный поворот для новых заметок
    };

    setNodes([...nodes, newNode]);
    setNodesAppearing(new Set([newId]));
    setTimeout(() => setNodesAppearing(prev => {
      const newSet = new Set(prev);
      newSet.delete(newId);
      return newSet;
    }), 300);
    setContextMenu(null);
  };

  const handleTogglePin = (nodeId: string) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, pinned: !node.pinned }
        : node
    ));
    setContextMenu(null);
  };

  const colorOptions = [
    { name: 'Синий', value: 'from-blue-500 to-blue-600' },
    { name: 'Голубой', value: 'from-cyan-500 to-cyan-600' },
    { name: 'Зелёный', value: 'from-green-500 to-green-600' },
    { name: 'Фиолетовый', value: 'from-purple-500 to-purple-600' },
    { name: 'Оранжевый', value: 'from-orange-500 to-orange-600' },
    { name: 'Розовый', value: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {(format === 'mindmap' || format === 'notes') ? (
        // Fullscreen mode for mindmap and notes
        <div className="fixed inset-0 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Вернуться к конвертеру</span>
            </button>
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                {format === 'mindmap' ? 'Визуальная карта знаний' : 'Краткие заметки'}
              </h1>
            </div>
            
            {/* Download Button for Fullscreen */}
            <div className="relative" ref={downloadMenuRef}>
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                Скачать
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showDownloadMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Форматы</p>
                    
                    <button
                      onClick={downloadAsText}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                    >
                      <FileText className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Текст (.txt)</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={downloadAsMarkdown}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                    >
                      <File className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Markdown (.md)</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={downloadAsHTML}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                    >
                      <FileImage className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">HTML (.html)</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={downloadAsJSON}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                    >
                      <File className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">JSON (.json)</p>
                      </div>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors text-left group"
                    >
                      <Copy className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Копировать</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Board */}
          <div className="flex-1 relative overflow-hidden">
            {/* Controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white/90 backdrop-blur-md rounded-lg p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Увеличить"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Уменьшить"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={resetView}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Сбросить вид"
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Selection Status Bar */}
            {(selectedNodes.size > 0 || selectedJunctions.size > 0) && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md rounded-lg px-4 py-3 shadow-lg border border-gray-200 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedNodes.size > 0 && (
                      <>Узлов: <span className="font-bold text-blue-600">{selectedNodes.size}</span></>
                    )}
                    {selectedNodes.size > 0 && selectedJunctions.size > 0 && ' | '}
                    {selectedJunctions.size > 0 && (
                      <>Точек: <span className="font-bold text-purple-600">{selectedJunctions.size}</span></>
                    )}
                  </span>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  {selectedNodes.size > 0 && (
                    <>
                      <button
                        onClick={() => {
                          // Дублировать выделенные элементы
                          const newNodes: DraggableNode[] = [];
                          nodes.forEach(node => {
                            if (selectedNodes.has(node.id)) {
                              const newId = `${node.id}_copy_${Date.now()}_${Math.random()}`;
                              newNodes.push({
                                ...node,
                                id: newId,
                                x: node.x + 50,
                                y: node.y + 50
                              });
                            }
                          });
                          setNodes([...nodes, ...newNodes]);
                        }}
                        className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors flex items-center gap-1.5"
                        title="Дублировать выделенные"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Дублировать</span>
                      </button>
                      <button
                        onClick={() => {
                          // Удалить выделенные элементы
                          setNodes(nodes.filter(node => !selectedNodes.has(node.id)));
                          setSelectedNodes(new Set());
                        }}
                        className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors flex items-center gap-1.5"
                        title="Удалить выделенные"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Удалить</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedNodes(new Set());
                      setSelectedJunctions(new Set());
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors flex items-center gap-1.5"
                    title="Снять выделение"
                  >
                    <X className="w-4 h-4" />
                    <span>Снять выделение</span>
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Board - Fullscreen */}
            <div
              ref={boardRef}
              className={`board-area absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-200 ${isPanning ? 'cursor-grabbing' : isSelecting ? 'cursor-crosshair' : 'cursor-default'}`}
              onMouseDown={handleBoardMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onContextMenu={(e) => handleContextMenu(e, null)}
            >
              {format === 'mindmap' && (
                <>
                  {/* SVG для линий связей */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <defs>
                      <style>{`
                        .line-animated { transition: opacity 0.3s ease, stroke-dashoffset 0.3s ease; }
                        .junction-animated { transition: fill 0.3s ease, opacity 0.3s ease; }
                        .group-animated { transition: opacity 0.3s ease; }
                      `}</style>
                    </defs>
                    {nodes.map(node => {
                      // Для узлов с точкой соединения (center, node1, node2, node3, node4)
                      if (node.junctionX !== undefined && node.junctionY !== undefined) {
                        const nodeX = node.x * zoom + pan.x;
                        const nodeY = node.y * zoom + pan.y;
                        const junctionX = node.junctionX * zoom + pan.x;
                        const junctionY = node.junctionY * zoom + pan.y;
                        const isNodeExpanded = expandedNodes.has(node.id);
                        const isCenterExpanded = expandedNodes.has('center');
                        
                        // Определяем видимость узла и его линий (проверяем всю цепочку родителей)
                        let isNodeVisible = true;
                        const underscoreCount = (node.id.match(/_/g) || []).length;
                        
                        if (node.id === 'center') {
                          isNodeVisible = true;
                        } else if (underscoreCount === 0) {
                          // Уровень 2 (node1, node2, ...) - виден если center развёрнут
                          isNodeVisible = isCenterExpanded;
                        } else if (underscoreCount === 1) {
                          // Уровень 3 (node1_0, ...) - виден если center и родитель развёрнуты
                          const parentId = node.id.split('_')[0];
                          isNodeVisible = isCenterExpanded && expandedNodes.has(parentId);
                        } else if (underscoreCount === 2) {
                          // Уровень 4 (node1_0_0, ...) - виден если вся цепочка развёрнута
                          const parts = node.id.split('_');
                          const level2ParentId = parts[0];
                          const level3ParentId = `${parts[0]}_${parts[1]}`;
                          isNodeVisible = isCenterExpanded && expandedNodes.has(level2ParentId) && expandedNodes.has(level3ParentId);
                        }
                        
                        // Получаем только дочерние узлы (не родительские)
                        const childConnections = node.connections?.filter(id => {
                          // Фильтруем родительские связи
                          if (id === 'center') return false;
                          if (underscoreCount === 1 && id === node.id.split('_')[0]) return false;
                          if (underscoreCount === 2) {
                            const parts = node.id.split('_');
                            if (id === `${parts[0]}_${parts[1]}`) return false;
                          }
                          return true;
                        }) || [];
                        
                        return (
                          <g key={`${node.id}-junction`} className="group-animated" style={{ opacity: isNodeVisible ? 1 : 0 }}>
                            {/* Линия от узла к точке соединения */}
                            <line x1={nodeX} y1={nodeY} x2={junctionX} y2={junctionY}
                              stroke="#64748b" strokeWidth="3" strokeDasharray="8,4" opacity="0.6" 
                              className="line-animated" style={{ pointerEvents: 'none' }} />
                            <line x1={nodeX} y1={nodeY} x2={junctionX} y2={junctionY}
                              stroke="#3b82f6" strokeWidth="2" strokeDasharray="0" opacity="0.3" 
                              className="line-animated" style={{ pointerEvents: 'none' }} />
                            
                            {/* Визуальная точка в SVG (декоративная) */}
                            {childConnections.length > 0 && (
                              <>
                                <circle cx={junctionX} cy={junctionY} r="6" 
                                  fill={isNodeExpanded ? "#3b82f6" : "#94a3b8"} opacity="0.9" 
                                  className="junction-animated" />
                                <circle cx={junctionX} cy={junctionY} r="4" fill="#ffffff" />
                              </>
                            )}
                            
                            {/* Линии от точки соединения к дочерним узлам */}
                            {childConnections.map(connId => {
                              const connectedNode = nodes.find(n => n.id === connId);
                              if (!connectedNode) return null;
                              const x2 = connectedNode.x * zoom + pan.x;
                              const y2 = connectedNode.y * zoom + pan.y;
                              
                              // Линии видны только если узел развёрнут
                              const lineVisible = isNodeExpanded;
                              
                              return (
                                <g key={`${node.id}-${connId}`} className="group-animated" 
                                   style={{ opacity: lineVisible ? 1 : 0, pointerEvents: 'none' }}>
                                  <line x1={junctionX} y1={junctionY} x2={x2} y2={y2}
                                    stroke="#64748b" strokeWidth="3" strokeDasharray="8,4" opacity="0.6" 
                                    className="line-animated" />
                                  <line x1={junctionX} y1={junctionY} x2={x2} y2={y2}
                                    stroke="#3b82f6" strokeWidth="2" strokeDasharray="0" opacity="0.3" 
                                    className="line-animated" />
                                </g>
                              );
                            })}
                          </g>
                        );
                      }
                      
                      return null;
                    })}
                  </svg>

                  {/* Кликабельные точки соединения (HTML элементы поверх SVG) */}
                  {nodes.map(node => {
                    if (node.junctionX === undefined || node.junctionY === undefined) return null;
                    
                    const junctionScreenX = node.junctionX * zoom + pan.x;
                    const junctionScreenY = node.junctionY * zoom + pan.y;
                    const isNodeExpanded = expandedNodes.has(node.id);
                    const isCenterExpanded = expandedNodes.has('center');
                    
                    // Определяем видимость узла
                    let isNodeVisible = true;
                    const underscoreCount = (node.id.match(/_/g) || []).length;
                    
                    if (node.id === 'center') {
                      isNodeVisible = true;
                    } else if (underscoreCount === 0) {
                      isNodeVisible = isCenterExpanded;
                    } else if (underscoreCount === 1) {
                      const parentId = node.id.split('_')[0];
                      isNodeVisible = isCenterExpanded && expandedNodes.has(parentId);
                    } else if (underscoreCount === 2) {
                      const parts = node.id.split('_');
                      isNodeVisible = isCenterExpanded && expandedNodes.has(parts[0]) && expandedNodes.has(`${parts[0]}_${parts[1]}`);
                    }
                    
                    // Получаем дочерние соединения
                    const childConnections = node.connections?.filter(id => {
                      if (id === 'center') return false;
                      if (underscoreCount === 1 && id === node.id.split('_')[0]) return false;
                      if (underscoreCount === 2) {
                        const parts = node.id.split('_');
                        if (id === `${parts[0]}_${parts[1]}`) return false;
                      }
                      return true;
                    }) || [];
                    
                    if (childConnections.length === 0) return null;
                    
                    return (
                      <div
                        key={`junction-${node.id}`}
                        className={`absolute z-20 p-2 ${draggedJunction === node.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                        style={{
                          left: junctionScreenX,
                          top: junctionScreenY,
                          transform: 'translate(-50%, -50%)',
                          opacity: isNodeVisible ? 1 : 0,
                          pointerEvents: isNodeVisible ? 'auto' : 'none',
                          willChange: draggedJunction === node.id ? 'left, top' : 'auto',
                          transition: draggedJunction === node.id ? 'none' : 'opacity 0.3s ease, left 0.08s ease-out, top 0.08s ease-out',
                        }}
                        onMouseDown={(e) => {
                          if (e.button !== 0) return; // Только левая кнопка
                          e.stopPropagation();
                          e.preventDefault();
                          // Сбрасываем флаг перемещения и сохраняем начальную позицию
                          setJunctionMoved(false);
                          setJunctionMouseStart({ x: e.clientX, y: e.clientY });
                          // Начинаем перетаскивание точки
                          const rect = boardRef.current?.getBoundingClientRect();
                          if (rect && node.junctionX !== undefined && node.junctionY !== undefined) {
                            const junctionScreenX = node.junctionX * zoom + pan.x;
                            const junctionScreenY = node.junctionY * zoom + pan.y;
                            setJunctionDragOffset({
                              x: e.clientX - rect.left - junctionScreenX,
                              y: e.clientY - rect.top - junctionScreenY
                            });
                            setDraggedJunction(node.id);
                            
                            // Если перетаскиваем выделенную точку - сохраняем позиции всех выделенных точек
                            if (selectedJunctions.has(node.id) && selectedJunctions.size > 1) {
                              const initialPositions = new Map<string, { x: number; y: number }>();
                              nodes.forEach(n => {
                                if (selectedJunctions.has(n.id) && n.junctionX !== undefined && n.junctionY !== undefined) {
                                  initialPositions.set(n.id, { x: n.junctionX, y: n.junctionY });
                                }
                              });
                              setSelectedJunctionsInitialPositions(initialPositions);
                            }
                          }
                        }}
                        onMouseUp={(e) => {
                          e.stopPropagation();
                          // Клик (expand/collapse) только если не было перетаскивания
                          if (draggedJunction === node.id && !junctionMoved) {
                            setExpandedNodes(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(node.id)) newSet.delete(node.id);
                              else newSet.add(node.id);
                              return newSet;
                            });
                          }
                          // Сразу сбрасываем состояние нажатия
                          setDraggedJunction(null);
                          setJunctionMoved(false);
                          setJunctionMouseStart(null);
                        }}
                      >
                        <div 
                          className={`w-5 h-5 rounded-full border-2 transition-all duration-300 shadow-md pointer-events-none ${
                            selectedJunctions.has(node.id)
                              ? 'ring-2 ring-blue-400 ring-offset-1'
                              : ''
                          } ${
                            draggedJunction === node.id 
                              ? 'bg-yellow-400 border-yellow-500 scale-125' 
                              : isNodeExpanded 
                                ? 'bg-blue-500 border-blue-600 hover:scale-110' 
                                : 'bg-gray-400 border-gray-500 hover:scale-110'
                          }`}
                        />
                      </div>
                    );
                  })}

                  {/* Selection Box */}
                  {isSelecting && selectionStart && selectionEnd && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-30"
                      style={{
                        left: `${Math.min(selectionStart.x, selectionEnd.x)}px`,
                        top: `${Math.min(selectionStart.y, selectionEnd.y)}px`,
                        width: `${Math.abs(selectionEnd.x - selectionStart.x)}px`,
                        height: `${Math.abs(selectionEnd.y - selectionStart.y)}px`,
                      }}
                    />
                  )}

                  {/* Draggable Nodes */}
                  {nodes.map(node => {
                    const isCenterExpanded = expandedNodes.has('center');
                    
                    // Определяем, виден ли узел
                    let isVisible = true;
                    
                    // Узлы второго уровня (node1, node2, node3, node4) - скрываем если центр свёрнут
                    if (node.id !== 'center' && !node.id.includes('_')) {
                      if (!isCenterExpanded) {
                        isVisible = false;
                      }
                    }
                    
                    // Узлы третьего уровня (node1_0, node2_1, и т.д.) - скрываем если центр или родитель свёрнут
                    const underscoreCount = (node.id.match(/_/g) || []).length;
                    if (underscoreCount === 1) {
                      // Уровень 3: node1_0
                      if (!isCenterExpanded) {
                        isVisible = false;
                      } else {
                        const parentId = node.id.split('_')[0];
                        if (!expandedNodes.has(parentId)) {
                          isVisible = false;
                        }
                      }
                    }
                    
                    // Узлы четвёртого уровня (node1_0_0, node1_0_1, и т.д.)
                    if (underscoreCount === 2) {
                      if (!isCenterExpanded) {
                        isVisible = false;
                      } else {
                        // Проверяем родителя уровня 2 (node1)
                        const level2ParentId = node.id.split('_')[0];
                        if (!expandedNodes.has(level2ParentId)) {
                          isVisible = false;
                        } else {
                          // Проверяем родителя уровня 3 (node1_0)
                          const parts = node.id.split('_');
                          const level3ParentId = `${parts[0]}_${parts[1]}`;
                          if (!expandedNodes.has(level3ParentId)) {
                            isVisible = false;
                          }
                        }
                      }
                    }
                    
                    return (
                    <div
                      key={node.id}
                      className={`absolute bg-gradient-to-br ${node.color} text-white rounded-lg p-2 shadow-lg ${node.pinned ? 'cursor-default' : 'cursor-move'} hover:shadow-xl select-none ${editingNode === node.id ? 'ring-2 ring-yellow-400' : ''} ${draggedNode === node.id ? 'scale-105' : 'scale-100'} ${nodesAppearing.has(node.id) ? 'node-appear' : ''} ${node.pinned ? 'ring-2 ring-yellow-300' : ''} ${selectedNodes.has(node.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                      style={{
                        left: node.x * zoom + pan.x,
                        top: node.y * zoom + pan.y,
                        transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.8})`,
                        minWidth: '100px',
                        maxWidth: '140px',
                        fontSize: '12px',
                        zIndex: draggedNode === node.id ? 20 : (node.pinned ? 15 : (selectedNodes.has(node.id) ? 12 : 10)),
                        opacity: isVisible ? 1 : 0,
                        pointerEvents: isVisible ? 'auto' : 'none',
                        willChange: draggedNode === node.id ? 'left, top, transform' : 'auto',
                        transition: (draggedNode === node.id || selectedNodes.has(node.id)) 
                          ? 'opacity 0.3s ease, transform 0.3s ease' 
                          : 'left 0.08s ease-out, top 0.08s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease, opacity 0.3s ease'
                      }}
                      onMouseDown={(e) => isVisible && handleMouseDown(e, node.id)}
                      onContextMenu={(e) => isVisible && handleContextMenu(e, node.id)}
                    >
                      {editingNode === node.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-2 text-sm text-white placeholder-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                            placeholder="Введите текст..."
                            autoFocus
                            onBlur={handleSaveEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                handleSaveEdit();
                              }
                              if (e.key === 'Escape') {
                                setEditingNode(null);
                                setEditContent('');
                              }
                            }}
                          />
                          <p className="text-xs opacity-70 text-center">Ctrl+Enter для сохранения</p>
                        </div>
                      ) : (
                        <>
                          {node.pinned && (
                            <div className="flex justify-end mb-1">
                              <Pin className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                            </div>
                          )}
                          <p className="font-bold text-sm whitespace-pre-line text-center">{node.content}</p>
                        </>
                      )}
                    </div>
                    );
                  })}
                </>
              )}

               {format === 'notes' && (
                 <>
                   {/* Selection Box */}
                   {isSelecting && selectionStart && selectionEnd && (
                     <div
                       className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-30"
                       style={{
                         left: `${Math.min(selectionStart.x, selectionEnd.x)}px`,
                         top: `${Math.min(selectionStart.y, selectionEnd.y)}px`,
                         width: `${Math.abs(selectionEnd.x - selectionStart.x)}px`,
                         height: `${Math.abs(selectionEnd.y - selectionStart.y)}px`,
                       }}
                     />
                   )}

                   {/* Draggable Notes - Sticky Notes Style */}
                   {nodes.map((node, index) => {
                     // Используем сохраненный угол поворота
                     const rotation = node.rotation || 0;
                     
                     return (
                       <div
                         key={node.id}
                         data-node-id={node.id}
                         className={`absolute bg-gradient-to-br ${node.color} text-white p-5 shadow-2xl ${node.pinned ? 'cursor-default' : 'cursor-move'} hover:shadow-3xl transition-all duration-300 select-none ${editingNode === node.id ? 'ring-2 ring-yellow-400' : ''} ${draggedNode === node.id ? 'scale-105 rotate-0' : 'scale-100'} ${nodesAppearing.has(node.id) ? 'node-appear' : ''} ${node.pinned ? 'ring-2 ring-yellow-300' : ''} ${selectedNodes.has(node.id) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                         style={{
                           left: node.x * zoom + pan.x,
                           top: node.y * zoom + pan.y,
                           transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                           minWidth: '220px',
                           maxWidth: '280px',
                           zIndex: draggedNode === node.id ? 20 : (node.pinned ? 15 : (selectedNodes.has(node.id) ? 12 : 10)),
                           filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
                           willChange: draggedNode === node.id ? 'left, top, transform' : 'auto',
                           transition: draggedNode === node.id || selectedNodes.has(node.id) ? 'none' : 'left 0.1s ease-out, top 0.1s ease-out, transform 0.15s ease-out, box-shadow 0.2s ease, filter 0.2s ease'
                         }}
                         onMouseDown={(e) => handleMouseDown(e, node.id)}
                         onContextMenu={(e) => handleContextMenu(e, node.id)}
                       >
                         {editingNode === node.id ? (
                           <div className="space-y-2">
                             <textarea
                               value={editContent}
                               onChange={(e) => setEditContent(e.target.value)}
                               className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded p-2 text-sm text-white placeholder-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-white/50"
                               placeholder="Введите текст..."
                               autoFocus
                               onBlur={handleSaveEdit}
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter' && e.ctrlKey) {
                                   handleSaveEdit();
                                 }
                                 if (e.key === 'Escape') {
                                   setEditingNode(null);
                                   setEditContent('');
                                 }
                               }}
                             />
                             <p className="text-xs opacity-70 text-center">Ctrl+Enter для сохранения</p>
                           </div>
                         ) : (
                           <>
                             {node.pinned && (
                               <div className="flex justify-end mb-1">
                                 <Pin className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                               </div>
                             )}
                             <p className="font-semibold text-sm whitespace-pre-line leading-relaxed">{node.content}</p>
                           </>
                         )}
                       </div>
                     );
                   })}
                 </>
               )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
              <div
                ref={contextMenuRef}
                className="fixed bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl shadow-2xl py-2 z-[100] min-w-[200px]"
                style={{
                  left: `${contextMenu.x}px`,
                  top: `${contextMenu.y}px`,
                  transform: 'translate(-10px, -10px)',
                  animation: 'fadeInScale 0.2s ease-out'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {contextMenu.nodeId ? (
                  <>
                    <button
                      onClick={() => handleEditNode(contextMenu.nodeId!)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Редактировать</span>
                    </button>
                    <button
                      onClick={() => handleDuplicateNode(contextMenu.nodeId!)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Дублировать</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => handleTogglePin(contextMenu.nodeId!)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
                    >
                      {nodes.find(n => n.id === contextMenu.nodeId)?.pinned ? (
                        <>
                          <PinOff className="w-4 h-4" />
                          <span>Открепить</span>
                        </>
                      ) : (
                        <>
                          <Pin className="w-4 h-4" />
                          <span>Закрепить</span>
                        </>
                      )}
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Цвет</div>
                    <div className="grid grid-cols-3 gap-2 px-4 py-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => handleChangeColor(contextMenu.nodeId!, color.value)}
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color.value} hover:scale-110 transition-transform border-2 border-transparent hover:border-gray-300`}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => handleDeleteNode(contextMenu.nodeId!)}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Удалить</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAddNode(contextMenu.x, contextMenu.y)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-3 text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить элемент</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Normal mode for summary and cards
        <>
          <Header />
          <div className="py-12 px-4 sm:px-6 lg:px-8">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Вернуться к конвертеру</span>
                </button>

                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                    Результат конвертации
                  </h1>
                  <p className="text-lg text-gray-600">
                    {format === 'summary' && 'Структурированный конспект'}
                    {format === 'cards' && 'Карточки для запоминания'}
                  </p>
                </div>
              </div>

              {/* Result Content */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-3xl shadow-2xl p-8 md:p-12">
                <div className={`bg-gray-50 rounded-xl border border-gray-200 ${
                  format === 'cards' ? 'p-8 min-h-[600px] overflow-y-auto' : 
                  'p-10 min-h-[500px] overflow-y-auto'
                }`}>
              {format === 'summary' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-6 text-2xl">📝 {aiData?.title || 'Конспект'}</h4>
                    <div className="space-y-5">
                      {aiData?.sections ? (
                        aiData.sections.map((section: any, index: number) => {
                          const colors = ['blue', 'cyan', 'green', 'purple', 'pink', 'orange'];
                          const color = colors[index % colors.length];
                          return (
                            <div key={index} className={`bg-white rounded-xl p-6 border-l-4 border-${color}-500 shadow-sm hover:shadow-md transition-shadow`}>
                              <p className="font-bold text-gray-800 mb-3 text-lg">{index + 1}. {section.heading}</p>
                              <p className="text-base text-gray-700 leading-relaxed mb-3">{section.content}</p>
                              {section.keyPoints && section.keyPoints.length > 0 && (
                                <ul className="text-base text-gray-700 space-y-2 ml-6 list-disc leading-relaxed">
                                  {section.keyPoints.map((point: string, idx: number) => (
                                    <li key={idx}>{point}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 shadow-sm">
                          <p className="text-gray-600">Загрузка данных...</p>
                        </div>
                      )}
                      {aiData?.conclusion && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                          <p className="font-bold text-gray-800 mb-2 text-lg">📌 Заключение</p>
                          <p className="text-base text-gray-700 leading-relaxed">{aiData.conclusion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {format === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiData?.cards ? (
                    aiData.cards.map((card: any, index: number) => {
                      const colors = ['blue', 'cyan', 'green', 'purple', 'pink', 'orange'];
                      const color = colors[index % colors.length];
                      return (
                        <div key={index} className={`bg-white rounded-xl p-6 border-2 border-${color}-300 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]`}>
                          <div className="flex items-start justify-between mb-4">
                            <span className={`text-sm font-semibold text-${color}-600 bg-${color}-50 px-3 py-1.5 rounded-full`}>
                              Карточка {index + 1}
                            </span>
                          </div>
                          <p className="font-bold text-gray-800 mb-3 text-lg">Вопрос:</p>
                          <p className="text-base text-gray-700 mb-4 leading-relaxed">{card.question}</p>
                          <div className="border-t-2 border-gray-200 pt-4">
                            <p className="font-bold text-gray-800 mb-3 text-lg">Ответ:</p>
                            <p className="text-base text-gray-600 leading-relaxed">{card.answer}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 bg-white rounded-xl p-6 border border-gray-200">
                      <p className="text-gray-600 text-center">Загрузка карточек...</p>
                    </div>
                  )}
                </div>
              )}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1" ref={downloadMenuRef}>
                    <button 
                      onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Download className="w-6 h-6" />
                      Скачать результат
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showDownloadMenu ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showDownloadMenu && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="p-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Форматы файлов</p>
                          
                          <button
                            onClick={downloadAsText}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                              <FileText className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Текстовый файл</p>
                              <p className="text-xs text-gray-500">.txt — простой текст</p>
                            </div>
                          </button>
                          
                          <button
                            onClick={downloadAsMarkdown}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                              <File className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Markdown</p>
                              <p className="text-xs text-gray-500">.md — форматированный текст</p>
                            </div>
                          </button>
                          
                          <button
                            onClick={downloadAsHTML}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                              <FileImage className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">HTML страница</p>
                              <p className="text-xs text-gray-500">.html — веб-страница</p>
                            </div>
                          </button>
                          
                          <button
                            onClick={downloadAsJSON}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                              <File className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">JSON данные</p>
                              <p className="text-xs text-gray-500">.json — структурированные данные</p>
                            </div>
                          </button>
                          
                          <div className="border-t border-gray-100 my-2"></div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Другие действия</p>
                          
                          <button
                            onClick={copyToClipboard}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors">
                              <Copy className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Копировать текст</p>
                              <p className="text-xs text-gray-500">В буфер обмена</p>
                            </div>
                          </button>
                          
                          <button
                            onClick={handlePrint}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors text-left group"
                          >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors">
                              <Printer className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Печать</p>
                              <p className="text-xs text-gray-500">Отправить на принтер</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleBack}
                    className="px-8 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl font-semibold text-lg transition-all duration-300"
                  >
                    Вернуться к конвертеру
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default ConverterResult;

