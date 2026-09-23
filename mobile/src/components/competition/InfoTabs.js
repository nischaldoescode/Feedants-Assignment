// info tabs
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Card } from './Shared';

// tab content is served from the backend
export function InfoTabs({ tabs }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);
  const [expanded, setExpanded] = useState(false);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.key === activeKey) || tabs[0],
    [activeKey, tabs]
  );

  if (!activeTab) {
    return null;
  }

  return (
    <Card>
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable key={tab.key} style={styles.tab} onPress={() => setActiveKey(tab.key)}>
            <Text style={[styles.tabText, tab.key === activeTab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {tab.key === activeTab.key && <View style={styles.indicator} />}
          </Pressable>
        ))}
      </View>

      <Text numberOfLines={expanded ? undefined : 3} style={styles.body}>
        {activeTab.body}
      </Text>

      <Pressable style={styles.more} onPress={() => setExpanded((value) => !value)}>
        <Text style={styles.moreText}>{expanded ? 'View less' : 'View more'}</Text>
        <ChevronDown
          color={colors.teal}
          size={20}
          style={expanded ? styles.chevronUp : undefined}
        />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  tab: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center'
  },
  tabTextActive: {
    color: colors.teal
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.teal
  },
  body: {
    marginTop: 15,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700'
  },
  more: {
    alignSelf: 'center',
    minHeight: 34,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  moreText: {
    color: colors.teal,
    fontWeight: '900'
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }]
  }
});
