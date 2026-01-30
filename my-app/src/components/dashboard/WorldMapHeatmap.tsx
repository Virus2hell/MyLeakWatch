import { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Globe } from 'lucide-react';
import { AttackByCountry } from '../../types/attack';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map country codes to geo IDs (ISO 3166-1 numeric)
const countryCodeToGeoId: Record<string, string> = {
  US: '840',
  RU: '643',
  CN: '156',
  KP: '408',
  IR: '364',
  BR: '076',
  IN: '356',
  DE: '276',
  GB: '826',
  FR: '250',
  JP: '392',
  KR: '410',
  UA: '804',
  IL: '376',
  NL: '528',
};

interface WorldMapHeatmapProps {
  data: AttackByCountry[];
}

export const WorldMapHeatmap = ({ data }: WorldMapHeatmapProps) => {
  const { countryAttacks, maxAttacks } = useMemo(() => {
    const attacks: Record<string, number> = {};
    let max = 0;

    data.forEach((item) => {
      const geoId = countryCodeToGeoId[item.countryCode];
      if (geoId) {
        attacks[geoId] = item.count;
        max = Math.max(max, item.count);
      }
    });

    return { countryAttacks: attacks, maxAttacks: max };
  }, [data]);

  const getColor = (geoId: string) => {
    const count = countryAttacks[geoId] || 0;
    if (count === 0) return 'hsl(var(--muted))';

    const intensity = count / maxAttacks;

    if (intensity > 0.7) return 'hsl(0, 70%, 50%)';
    if (intensity > 0.4) return 'hsl(25, 90%, 55%)';
    if (intensity > 0.2) return 'hsl(45, 90%, 55%)';
    return 'hsl(142, 70%, 45%)';
  };

  const getCountryName = (geoId: string) => {
    const entry = Object.entries(countryCodeToGeoId).find(
      ([, id]) => id === geoId
    );

    if (entry) {
      const countryData = data.find(
        (d) => d.countryCode === entry[0]
      );
      return countryData
        ? `${countryData.country}: ${countryData.count} attacks`
        : null;
    }
    return null;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Global Attack Density
        </h3>
      </div>

      {/* Content */}
      <div className="relative aspect-[2/1] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 30],
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => {
                  const geoId = geo.id;
                  const tooltip = getCountryName(geoId);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(geoId)}
                      stroke="hsl(var(--border))"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'fill 0.2s ease',
                        },
                        hover: {
                          fill: 'hsl(var(--primary))',
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                      data-tooltip={tooltip}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-background/80 p-3 backdrop-blur-sm">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">
            Attack Density
          </span>

          <div className="flex gap-0.5">
            <div className="h-3 w-6 rounded-l bg-[hsl(142,70%,45%)]" />
            <div className="h-3 w-6 bg-[hsl(45,90%,55%)]" />
            <div className="h-3 w-6 bg-[hsl(25,90%,55%)]" />
            <div className="h-3 w-6 rounded-r bg-[hsl(0,70%,50%)]" />
          </div>

          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};
